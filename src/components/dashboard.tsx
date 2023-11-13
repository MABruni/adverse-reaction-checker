import { FiInfo } from 'react-icons/fi'
import "./dashboard.css"
import Search_bar from './search_bar';
import Validation from './validation';

interface DashboardProps {
    onResult: (data: Array<string | string[] | string[][]>[]) => void;
    validation: Array<string | string[] | string[][]>[];
}

const Dashboard: React.FC<DashboardProps> = ({ validation, onResult }) => {
    return (
        <>
            <div className="user-info">
                <div className="title">
                    Adverse Reaction Checker
                </div>
                <div className="explanation">
                    Welcome to the adverse reaction checker.<br/>
                    This program allows you to see which are the adverse reactions that have been reported by patients and healthcare providers for a certain drug.<br/><br/>
                    To start, please search for a drug by brand name or active ingredient by typing it in the search bar.
                </div>
            </div>
            <div className='search-bar-container'>
                <Search_bar onDataFetched={onResult}/>
                <div className="tooltip">
                    <FiInfo className='icon'/>
                    <span className='icon-message'>Learn More</span>
                    <span className='tooltip-message'>
                        Brand names are names assigned by companies, for example Tylenol<sup>&copy;</sup><br/>
                        Active ingredients are their scientific names.<br/>
                        If you are not sure, just input a name and we will show you matching results.
                    </span>
                </div>
            </div>
            <div className='val-table'>
                <Validation data={validation}/>
            </div>
        </>
    )
}

export default Dashboard;