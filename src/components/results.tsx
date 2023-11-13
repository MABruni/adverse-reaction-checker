import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./results.css";
import { FaCaretDown } from 'react-icons/fa';

interface eventData {
    term: string;
    count: number;
}

const Results: React.FC = (() => {
    const [empty, set_empty] = useState<boolean>(true);
    const [sorting_option, set_sorting] = useState<string>("count");
    const location = useLocation();
    const [dropdown, set_dropdown] = useState<boolean>(false);
    const events_data: eventData[] = location.state?.event_data || [];
    let selected_item: string[] = location.state?.selected_item || [];

    // Use to hide the table is no data has been sent to results.
    useEffect(() => {
        if (events_data.length === 0) {
            set_empty(true) 
        } else {
            set_empty(false);
        }
    }, [events_data]);

    // Sorts data based on user selection.
    const sort_data = (data: eventData[]) => {
        const sorted_data = [...data];
        sorted_data.sort((a, b) => {
            if (sorting_option === "term") {
                return a.term.localeCompare(b.term);
            } else if (sorting_option === "count") {
                return b.count - a.count;
            }
            return 0;
        });
        return sorted_data;
    };

    const sorted_data = sort_data(events_data);
    const total_reactions = sorted_data.reduce((total, item) => total + item.count, 0);
    if (selected_item[2] == "") {
        selected_item[0] = "";
    }

    return (
        <>
            <div className="drug-container">
                <div className="selected-drug">You are seeing information for:<br/> {selected_item.map((item, index) => (
                    <span key={index}> {item} </span>))}
                </div>
            </div>
            <div className="information">
                <div className={`sort-dropdown ${empty ? 'empty' : 'show'}`}>
                    <button className="sort-button" onClick={() => set_dropdown(!dropdown)}>Sort
                        <FaCaretDown className="dropdown-icon"/>
                    </button>
                    {dropdown && (
                        <div className="options">
                            <button onClick={() => {set_sorting("term"); set_dropdown(false);}}>Event</button>
                            <button onClick={() => {set_sorting("count"); set_dropdown(false);}}>Count</button>
                        </div>
                    )}
                </div>
                <div className={`table-container ${empty ? 'empty' : 'show'}`}>
                    <table className="table">
                        <thead>
                            <tr className="headers">
                                <th></th>
                                <th>Adverse Event</th>
                                <th>Percentage</th>
                                <th>Times Reported</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sorted_data.map((item, i) => {
                                return (
                                    <tr key={i} className="rows">
                                        <td>{i+1}</td>
                                        <td>{item.term}</td>
                                        <td>{((item.count/total_reactions)*100).toFixed(2)}</td>
                                        <td>{item.count}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
})

export default Results