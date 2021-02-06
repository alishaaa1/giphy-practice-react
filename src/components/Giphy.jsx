import React, {useEffect,useState} from "react";
import axios from "axios";
import Loader from "./Loader";
import {DragSource, useDrag} from 'react-dnd'
import Pagination from "./Pagination";

const Giphy = () =>{
    const [data, setData] = useState([]);
    const [Search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    //Error handling
    const [isError, setIsError] = useState(false);
    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    //Number of GIFs per page
    const [itemsPerPage, setItemsPerPage] = useState(15);
    const indexOfLastItem = currentPage*itemsPerPage;
    const indexOfFirstItem = indexOfLastItem-itemsPerPage;
    const CurrentItems = data.slice(indexOfFirstItem,indexOfLastItem);

    //page 1 - item 1 - item 15
    //page 2 - item 16 - item 30

    useEffect(()=>{
        const fetchData = async() =>{
            setIsError(false)
            setIsLoading(true);
            //Trending GIFs api call
            try{
                const results= await axios("https://api.giphy.com/v1/gifs/trending",{
                    params:{
                        api_key: "2qCyKinlFywwZq6N9CTxgSQdTyyNLktG",
                    }
                });
                setData(results.data.data);

            } catch(err){
                setIsError(true);
            }
            setIsLoading(false);
        }
        fetchData();
    },[]);

    const renderGifs=()=>{
        if(isLoading){
            return <Loader/>;
        }
        return CurrentItems.map(el =>{
            const gif_id = el.id;
            return (
                <div key={el.id} className="gif">
                    <img src={el.images.fixed_height.url}/>
                </div>
            )
        })
    }
    //Error handling
    const renderError = () =>{
        if(isError){
            return(
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    Unable to fetch gifs. Please try again later.
                </div>
            )
        }
    }
    const handleSearchChange = event =>{
        setSearch(event.target.value);
    }

    const handleSubmit = async event =>{
        event.preventDefault();
        setIsError(false);
        setIsLoading(true);

        //Search GIFs api call
        try{
            const results = await axios("https://api.giphy.com/v1/gifs/search",{
                params:{
                    api_key: "2qCyKinlFywwZq6N9CTxgSQdTyyNLktG",
                    q:Search,
                }
            });
            setData(results.data.data);
        } catch (err){
            setIsError(true);
        }
        setIsLoading(false);
    };

    const selectedPage = (pageNumber) =>{
        setCurrentPage(pageNumber)
    }

    return (
        <div className="m-2">
            {renderError()}
            <form className="form-inline justify-content-center">
                <input
                    value={Search}
                    onChange={handleSearchChange}
                    type="text"
                    placeholder="Search GIFs"
                    className="form-control"/>
                <button onClick={handleSubmit} type="submit" className="btn btn-primary">Search</button>
            </form>
            <Pagination selectedPage={selectedPage} currentPage={currentPage} itemsPerPage={itemsPerPage} totalItems={data.length}/>
            <div className="container gifs">{renderGifs()}</div>
        </div>
    )
}

export default Giphy