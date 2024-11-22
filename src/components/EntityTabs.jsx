import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const EntityTabs = ({ tabsConfig }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const initialTab = parseInt(queryParams.get("tab"), 10) || 0;

    const [activeTab, setActiveTab] = useState(initialTab);

    const handleChange = (event, newValue) => {
        setActiveTab(newValue);
        queryParams.set("tab", newValue);
        navigate({ search: queryParams.toString() }, { replace: true });
    };

    useEffect(() => {
        const tabFromUrl = parseInt(queryParams.get("tab"), 10) || 0;
        setActiveTab(tabFromUrl);
    }, [location.search]);

    return (
        <Box sx={{ width: "100%" }}>
            <Tabs value={activeTab} onChange={handleChange}>
                {tabsConfig.map((tab, index) => (
                    <Tab key={index} label={tab.label} />
                ))}
            </Tabs>
            <Box sx={{ p: 3 }}>
                {tabsConfig.map((tab, index) =>
                    index === activeTab ? (
                        <Box key={index}>{tab.component ? <tab.component /> : <div>No Component</div>}</Box>
                    ) : null
                )}
            </Box>
        </Box>
    );
};

export default EntityTabs;
