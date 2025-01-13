import {Route, Routes, Navigate} from "react-router-dom";
import Writers from "../pages/publishing/writers/index.jsx";
import Deals from "../pages/common/Deals/index.jsx";
import DealsListPage from "../pages/common/Deals/index.jsx";
import WriterDetailPage from "../pages/publishing/writers/id.jsx";
import WorksListPage from "../pages/publishing/Works/index.jsx";
import WorksDetailPage from "../pages/publishing/Works/id.jsx";
import {TestPage} from "../pages/TestPage.jsx";
import SignInScreen from "./Auth/SignInScreen.jsx";
import ArtistListPage from "../pages/common/Artists/index.jsx";
import ArtistDetailPage from "../pages/common/Artists/id.jsx";
import BusinessEntitiesListPage from "../pages/common/Business-Entities/index.jsx";
import UtilitiesListPage from "../pages/publishing/utilities/index.jsx";
import FileUploaderPage from "../pages/publishing/Utilities/FileUploaderPage.jsx";
import BusinessEntitiesDetailPage from "../pages/common/Business-Entities/id.jsx";
import DealDetailPage from "../pages/common/Deals/id.jsx";
import ManageAttachmentsPage from "../pages/common/Business-Entities/ManageAttachmentsPage.jsx";
import UserManagement from "../pages/publishing/Utilities/UserManagement.jsx";
import TracksListPage from "../pages/common/Tracks/index.jsx";
import TracksDetailsPage from "../pages/common/Tracks/id.jsx";

export const ApiRouter = () => {
    return (
        <>
            <Routes>

  {/* BusinessEntities */}
  <Route path='/business-entities' element={<BusinessEntitiesListPage />}/>
  <Route path='/BE/:BusinessEntitiesId' element={<BusinessEntitiesDetailPage />}/>
  <Route path="/BE/:BusinessEntitiesId/:BusinessEntitiesName/attachments/manage" element={<ManageAttachmentsPage />} />



                     {/* Artists */}
                     <Route path='/artists' element={<ArtistListPage/>}/>
                {/* <Route path='/artist/:id' element={<ArtistDetailPage/>}/> */}
                <Route path="/artists/:artistId" element={<ArtistDetailPage />} />

                {/* Writers */}
                <Route path='/writers' element={<Writers/>}/>
                <Route path='/writers/:id' element={<WriterDetailPage/>}/>

                {/* Works */}
                <Route path='/works' element={<WorksListPage/>}/>
                <Route path='/works/:id' element={<WorksDetailPage/>}/>

                {/* Flexible route for nested works */}
                <Route
                    path='/writers/:writerId/works/:id'
                    element={<Navigate to="../works/:id" replace/>}
                />

             {/* Deals */}
<Route path="/deals" element={<DealsListPage />} />
<Route path="/deals/:dealId" element={<DealDetailPage />} />

             {/* Tracks */}
             <Route path="/tracks" element={<TracksListPage />} />

<Route path="/tracks/:trackId" element={<TracksDetailsPage />} />


            <Route path="/signin" element={<SignInScreen />} />  {/* Add the sign-in route so it can be called at the time of logout */}

            
                {/* Utilities */}
                <Route path='/utilities' element={<UtilitiesListPage/>}/>
                <Route path="/utilities/file-uploader" element={<FileUploaderPage />} />
                <Route path="/utilities/user-management" element={<UserManagement />} />



                <Route path={'/test'} element={<TestPage/>}/>
            </Routes>
        </>
    );
};
