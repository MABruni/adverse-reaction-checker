import { useState, useEffect } from 'react';
import './search_bar.css';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa'

interface Product {
    products: string;
    brand_name: string;
    dosage_form: string;
    active_ingredients: Ingredients [];
    marketing_status: string;
}

interface Ingredients {
    name: string;
    strength: string;
    length: number;
}

interface SearchBarProps {
    onDataFetched: (data: Array<string | string[] | string[][]>[]) => void;
}


const Search_bar: React.FC<SearchBarProps> = ({ onDataFetched }) => {
    const [value, set_value] = useState<string>('');
    const [result, set_result] = useState<Array<string | string[] | string[][]>[]>([]);
    const [err_msg, set_msg] = useState<boolean>(false);

    // Axios query to fetch information from generic name.
    async function axios_active_ingredient(value_upper: string) {
        const active_ingredient_query = `
        https://api.fda.gov/drug/drugsfda.json?search=openfda.generic_name:${value_upper}
        +AND+marketing_status=1
        +OR+marketing_status=4&limit=1
        `
        const response =  await axios.get(active_ingredient_query);
        return response.data
    }

    // Axios query to fetch information from brand name.
    async function axios_brand(value_upper: string) {
        const brand_query = `
        https://api.fda.gov/drug/drugsfda.json?search=products.brand_name.exact:${value_upper}
        `
        const response = await axios.get(brand_query);
        const filtered_products = response.data.results[0].products.filter((product: Product) =>
        product.marketing_status !== 'Discontinued'); 
        return filtered_products;
    }

    // Checks if user has inputted a value
    function validate_value(value: string):string {
        if (!value) {
            return ""
        } else {
            return value.toUpperCase(); 
        }
    }

    // Retrieve generic name from active ingredient information.
    function get_generic_name(active_ingredient_data: any, value_upper: string) {
        return active_ingredient_data.results[0].products.map((product: Product) => {
            if (product.active_ingredients.length > 1) {
                for (let i = 0; i < product.active_ingredients.length; i++) {
                    if (product.active_ingredients[i].name.includes(value_upper)) {
                        return product.active_ingredients[i].name;
                    }
                }
            } else {
                return product.active_ingredients[0].name;
            }
        })
    }

    // Retrieve generic name from brand information.
    function get_generic_from_brand(product: Product) {
        if (product.active_ingredients.length === 1) {
            return product.active_ingredients[0].name
        } else {
            return product.active_ingredients.map((ingredients: Ingredients) => {
                return ingredients.name
            })
        }
    }

    // Finds the strength from brand information.
    function find_strength(filtered_products: any) {
        const strength: string [] | string [][] = filtered_products.map((product: Product) => {
            if (product.active_ingredients.length === 1) {
                return product.active_ingredients[0].strength
            }
            return product.active_ingredients.map((ingredients: Ingredients) => {
                return ingredients.strength
            })
        })
        return strength;
    }

    // Saves final result of searching an active ingredient.
    function set_final_result(result: any) {
        const final_result: any = [result];
        set_result(final_result as string[][]);
    }

    // Saves the final result of searching a brand name.
    function set_result_brand(brand_name:any, generic_name:any, strength:any, dosage:any) {
        const final_result = Array.isArray(brand_name) ? brand_name.map((brand, i) => {
                const formatted_name = Array.isArray(generic_name[i]) 
                    ? (generic_name[i] as string []).join('/') 
                    : generic_name[i];
                const formatted_strength = Array.isArray(strength[i])
                    ? (strength[i] as string []).join('/') 
                    : strength[i];        
                return [brand, formatted_name, formatted_strength, dosage[i]];
            }) : [[brand_name[0], generic_name[0], strength[0], dosage[0]]];
        set_result(final_result)
    }


    // Searches database for active ingredient.
    async function search_active_ingredient(value_upper: string) {
        try {
            const active_ingredient_data = await axios_active_ingredient(value_upper);
            const generic_name: any = get_generic_name(active_ingredient_data, value_upper);
            const brand_name: any =  active_ingredient_data.results[0].products.map(
                (product: Product) => {return product.brand_name;}
            )
            set_final_result([brand_name, generic_name, '', ''])
        } catch(e) {
            search_brand_name(value_upper);
        }
    }

    // Searches database for brand name.
    async function search_brand_name(value_upper: string) {
        const filtered_products = await axios_brand(value_upper);
        const brand_name: string [] | string [][] = filtered_products.map(
            (product: Product) => {return product.brand_name})
        const dosage: string [] | string [][] = filtered_products.map(
            (product: Product) => {return product.dosage_form})
        const generic_name: string [] | string [][] = filtered_products.map(
            (product: Product) => {return get_generic_from_brand(product)})      
        const strength: string [] | string [][] = find_strength(filtered_products);
        set_result_brand(brand_name, generic_name, strength, dosage);
    }
    
    // Searches user input.
    const handle_submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const value_upper: string = validate_value(value); 
        if (value_upper == "") return;
        try {
            search_active_ingredient(value_upper); 
        } catch(error:any) {
            set_msg(true)
            set_result([])
        }
    }

    // Displays an informative message to the user if query returns empty.
    useEffect(() => {
        if (result.length === 0 && value !== '') {
            set_msg(true);
        } else {
            set_msg(false);
        }
        onDataFetched(result);
    }, [result, onDataFetched]);

    return (
        <>
            <div className='search-wrapper'>
                <form onSubmit={handle_submit} className='form'>
                    <FaSearch className="search-icon"/>
                    <input
                        type="text"
                        name="search-bar"
                        className={`search-bar ${err_msg ? 'invalid' : ''}`}
                        placeholder="Input a brand name or active ingredient"
                        value = { value }
                        onChange={(e) => {
                            set_value(e.target.value)
                        }}
                    />
                    <button type='submit' className="search-button">Search</button>
                </form>
            </div>
            <div className={`e-msg ${err_msg ? 'invalid' : ''}`}>
                <p> Your input found no results in the FDA database<br />or the drug you are looking for has been discontinued </p>
            </div>
        </>
    )
}

export default Search_bar;
