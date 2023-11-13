import './validation.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface ValidationProps {
    data: Array<string | string[] | string[][]>[];
}

const Validation: React.FC<ValidationProps> = ({ data }) => {
    const [empty, set_empty] = useState<boolean>(true);
    const [event_data, set_data] = useState<[]>([]);
    const [selected_item, set_item] = useState<string[]>([]);
    const navigate = useNavigate();

    // Displays table only if data is present.
    useEffect (() => {
        if (data.length === 0) {
            set_empty(true)
        } else {
            set_empty(false)
        }
    }, [data])

    // Perform adverse event query for drug selected by the user.
    const handle_select = async function (information: string[]) {
        const response = await axios.get(`http://localhost:4000/?search=${information[0]}`);
        const adverse_events = response.data;
        set_data(adverse_events);
        set_item(information);
    }

    // Stores information in state so the results page has access to them.
    useEffect (() => {
        if (event_data.length !== 0) {
            navigate('/results', { state: { event_data, selected_item }});
        }
    }, [event_data, selected_item])
        
    return (
        <div className={`table-container ${empty ? 'empty' : 'show'}`}>
            <table className="table">
                <thead>
                    <tr className="headers">
                        <th>Brand Name</th>
                        <th>Active Ingredient</th>
                        <th>Strength</th>
                        <th>Form</th>
                        <th>Selection</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, i) => {
                        return (
                            <tr key={i} className="rows">
                                {item[2] ? <td>{item[0]}</td> : <td/>}
                                <td>{item[1]}</td>
                                <td>{item[2]}</td>
                                <td>{item[3]}</td>
                                <td><button className='select-button' onClick={() => handle_select(item as string[])}>Select</button></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default Validation;