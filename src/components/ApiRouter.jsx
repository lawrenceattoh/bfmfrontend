import {Route, Routes, Navigate} from "react-router-dom";
import Writers from "../pages/publishing/Writers/index.jsx";
import Deals from "../pages/common/Deals/index.jsx";
import DealsListPage from "../pages/common/Deals/index.jsx";
import WriterDetailPage from "../pages/publishing/Writers/id.jsx";
import WorksListPage from "../pages/publishing/Works/index.jsx";
import WorksDetailPage from "../pages/publishing/Works/id.jsx";
import {TestPage} from "../pages/TestPage.jsx";
import SignInScreen from "./Auth/SignInScreen.jsx";
import ArtistListPage from "../pages/common/Artists/index.jsx";
import ArtistDetailPage from "../pages/common/Artists/id.jsx";

export const ApiRouter = () => {
    return (
        <>
            <Routes>

                     {/* Artists */}
                     <Route path='/artists' element={<ArtistListPage/>}/>
                {/* <Route path='/artist/:id' element={<ArtistDetailPage/>}/> */}
                <Route path="/artists/:artistId" element={<ArtistDetailPage />} />

                {/* Writers */}
                <Route path='/publishing/writers' element={<Writers/>}/>
                <Route path='/publishing/writers/:id' element={<WriterDetailPage/>}/>

                {/* Works */}
                <Route path='/publishing/works' element={<WorksListPage/>}/>
                <Route path='/publishing/works/:id' element={<WorksDetailPage/>}/>

                {/* Flexible route for nested works */}
                <Route
                    path='/publishing/writers/:writerId/works/:id'
                    element={<Navigate to="../works/:id" replace/>}
                />

                {/* Deals */}
                {/* <Route path='/deals' element={<Deals/>}/> */}
                <Route path='/deals' element={<DealsListPage/>}/>

            <Route path="/signin" element={<SignInScreen />} />  {/* Add the sign-in route so it can be called at the time of logout */}

                <Route path={'/test'} element={<TestPage/>}/>
            </Routes>
        </>
    );
};
