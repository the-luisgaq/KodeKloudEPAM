import { useLocation } from "react-router-dom";
import { MainMenu, MainMenuButton } from "@epam/uui";
import logo from '../icons/logo.svg';


export const Menu = () => {
    useLocation();
    return (
        <MainMenu appLogoUrl={logo}>
            <MainMenuButton
                caption="Home"
                link={{ pathname: '/' }}
                priority={1}
                estimatedWidth={72}
            />
        </MainMenu>
    )
}