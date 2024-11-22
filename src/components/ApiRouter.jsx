import {Route, Routes, Navigate} from "react-router-dom";
import Writers from "../pages/publishing/Writers/index.jsx";
import Deals from "../pages/common/Deals/index.jsx";
import DealsListPage from "../pages/common/Deals/index.jsx";
import WriterDetailPage from "../pages/publishing/Writers/id.jsx";
import WorksListPage from "../pages/publishing/Works/index.jsx";
import WorksDetailPage from "../pages/publishing/Works/id.jsx";
import {TestPage} from "../pages/TestPage.jsx";

export const ApiRouter = () => {
    return (
        <>
            <Routes>
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
                <Route path='/deals' element={<Deals/>}/>
                <Route path='/deals' element={<DealsListPage/>}/>


                <Route path={'/test'} element={<TestPage/>}/>
            </Routes>
        </>
    );
};
