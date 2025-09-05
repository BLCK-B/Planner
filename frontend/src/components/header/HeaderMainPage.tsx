import BaseHeader from "@/components/header/BaseHeader.tsx";
import TopActions from "@/components/header/TopActions.tsx";

const HeaderMainPage = () => {

    const leftContent = (
        <>
            <TopActions/>
        </>
    );

    return (
        <BaseHeader leftSide={leftContent} menu={true}/>
    );
};
export default HeaderMainPage;