import { useCallback, useRef } from 'react';
import { CascadeSelectionTypes, DataSourceState, LazyDataSourceApi } from '../../../../../../../types';
import isEqual from 'react-fast-compare';
import { TreeState } from '../../../treeState';
import { Tree } from '../../../Tree';
import { LazyTreeProps } from './types';
import { CommonTreeConfig } from '../types';
import { ROOT_ID } from '../../../constants';
import { LoadAllConfig, TreeStructureId } from '../../../treeState/types';

export interface UseLoadDataProps<TItem, TId, TFilter = any> extends
    Pick<LazyTreeProps<TItem, TId, TFilter>, 'getChildCount'>,
    Pick<CommonTreeConfig<TItem, TId, TFilter>, 'dataSourceState' | 'cascadeSelection'> {

    api: LazyDataSourceApi<TItem, TId, TFilter>;
    filter?: TFilter;
    isFolded: (item: TItem) => boolean;
    fetchStrategy?: 'sequential' | 'parallel';
    flattenSearchResults?: boolean;
    getChildCount?(item: TItem): number;
}

export interface LoadResult<TItem, TId> {
    isUpdated: boolean;
    isOutdated: boolean;
    tree: TreeState<TItem, TId>;
}

interface LoadMissingOptions<TItem, TId, TFilter> {
    using?: TreeStructureId;
    tree: TreeState<TItem, TId>;
    abortInProgress?: boolean;
    loadAllChildren?(id: TId): LoadAllConfig;
    isLoadStrict?: boolean;
    dataSourceState?: DataSourceState<TFilter, TId>;
}

export function useLoadData<TItem, TId, TFilter = any>(
    props: UseLoadDataProps<TItem, TId, TFilter>,
) {
    const { api, filter, isFolded, cascadeSelection } = props;

    const promiseInProgressRef = useRef<Promise<LoadResult<TItem, TId>>>(undefined);

    const loadMissingImpl = useCallback(async ({
        using,
        tree,
        loadAllChildren = () => ({ nestedChildren: true, children: false }),
        isLoadStrict,
        dataSourceState,
    }: LoadMissingOptions<TItem, TId, TFilter>): Promise<LoadResult<TItem, TId>> => {
        const loadingTree = tree;
        const completeDsState = { ...props.dataSourceState, ...dataSourceState };
        try {
            const newTreePromise = tree.load({
                using,
                options: {
                    ...props,
                    loadAllChildren,
                    isLoadStrict,
                    isFolded,
                    api,
                    filter: {
                        ...filter,
                        ...props.dataSourceState?.filter,
                        ...dataSourceState?.filter,
                    },
                },
                dataSourceState: completeDsState,
            });

            const newTree = await newTreePromise;
            const linkToTree = tree;

            // If tree is changed during this load, than there was reset occurred (new value arrived)
            // We need to tell caller to reject this result
            const isOutdated = linkToTree !== loadingTree;
            const isUpdated = linkToTree !== newTree;
            return { isUpdated, isOutdated, tree: newTree };
        } catch (e) {
            // TBD - correct error handling
            console.error('LazyListView: Error while loading items.', e);
            return { isUpdated: false, isOutdated: false, tree: loadingTree };
        }
    }, [isFolded, api, filter, props.dataSourceState]);

    const loadMissing = useCallback(({
        tree,
        using,
        abortInProgress,
        loadAllChildren,
        isLoadStrict,
        dataSourceState,
    }: LoadMissingOptions<TItem, TId, TFilter>): Promise<LoadResult<TItem, TId>> => {
        // Make tree updates sequential, by executing all consequent calls after previous promise completed
        if (!promiseInProgressRef.current || abortInProgress) {
            promiseInProgressRef.current = Promise.resolve({ isUpdated: false, isOutdated: false, tree });
        }

        promiseInProgressRef.current = promiseInProgressRef.current.then(({ tree: currentTree }) =>
            loadMissingImpl({ tree: currentTree, using, loadAllChildren, isLoadStrict, dataSourceState }));

        return promiseInProgressRef.current;
    }, [loadMissingImpl]);

    const loadMissingOnCheck = useCallback(async (currentTree: TreeState<TItem, TId>, id: TId, isChecked: boolean, isRoot: boolean) => {
        const isImplicitMode = cascadeSelection === CascadeSelectionTypes.IMPLICIT;

        if (!cascadeSelection && !isRoot) {
            return currentTree;
        }

        const parents = Tree.getParents(id, currentTree.full);
        const { tree: treeWithMissingRecords } = await loadMissing({
            tree: currentTree,
            // If cascadeSelection is implicit and the element is unchecked, it is necessary to load all children
            // of all parents of the unchecked element to be checked explicitly. Only one layer of each parent should be loaded.
            // Otherwise, should be loaded only checked element and all its nested children.
            loadAllChildren: (itemId) => {
                const loadAllConfig = { nestedChildren: !isImplicitMode, children: false };
                if (!cascadeSelection) {
                    return { ...loadAllConfig, children: isChecked && isRoot };
                }

                if (!isChecked && isRoot) {
                    return { ...loadAllConfig, children: false };
                }

                if (isImplicitMode) {
                    return { ...loadAllConfig, children: itemId === ROOT_ID || parents.some((parent) => isEqual(parent, itemId)) };
                }

                const { ids } = currentTree.full.getItems(undefined);
                const rootIsNotLoaded = ids.length === 0;

                const shouldLoadChildrenAfterSearch = (!!props.dataSourceState.search?.length
                    && (parents.some((parent) => isEqual(parent, itemId))
                    || (itemId === ROOT_ID && rootIsNotLoaded)));

                // `isEqual` is used, because complex ids can be recreated after fetching of parents.
                // So, they should be compared not by reference, but by value.
                const shouldLoadAllChildren = isRoot
                    || isEqual(itemId, id)
                    || shouldLoadChildrenAfterSearch;

                return {
                    children: shouldLoadAllChildren,
                    // If checking is run after the search, it is required to load only
                    // children of the checked item parents, without nestings.
                    nestedChildren: !shouldLoadChildrenAfterSearch,
                };
            },
            isLoadStrict: true,
            dataSourceState: { search: null },
            using: 'full',
        });

        return treeWithMissingRecords;
    }, [cascadeSelection, loadMissing, props.dataSourceState.search]);

    return { loadMissing, loadMissingOnCheck };
}
