import React from "react";
import { useState, useEffect } from "react";

export function Card(props) {
    const [data, setData] = useState([]);

    useEffect(() => {
        async function getData() {

            // get data from realtime database
            try {
                const resp = await fetch('https://test-project-ee7de-default-rtdb.firebaseio.com/data.json');
                if (resp.ok) {
                    setData(await resp.json());
                } else {
                    throw resp;
                }
            } catch (error) {
                console.log(error);
            }
        }
        getData();
    }, []);

    const updateData = async (id) => {
        const index = data.findIndex((d) => d.id === id);
        if (data[index].isLike) {
            data[index].likes ++;
        } else {
            data[index].dislikes ++;
        }

        // Update firebase realtime database
        try {
            await fetch(`https://test-project-ee7de-default-rtdb.firebaseio.com/data/${index}/.json`, {
                method: 'PATCH',
                // headers: { 'Content-Type':'application/x-www-form-urlencoded' },
                body: JSON.stringify(data[index])
            });
            setData([...data]);
        } catch (error) {
            console.log(error);
        }
    };

    const setIsLikeStatus =  (id, like) => {
        const index = data.findIndex((d) => d.id === id);
        data[index].isLike = like;
        return setData([...data]);
    };

    const getPercent = (likes, totalLikes) => {
        if(totalLikes === 0) {
            return 0;
        }

        return Math.round(likes / totalLikes * 100);

    }

    return (
        <div style={{display: 'flex'}}>
            {data.map(dat => {
                return (
                    <div style={{border: 'solid'}} key={dat.id}>
                        <p style={{fontSize: 'small', display: 'flex'}}>{dat.isLike ? 'like selected' : 'dislike selected'}</p>
                        <button onClick={() => setIsLikeStatus(dat.id, true)}>Like</button>
                        <button onClick={() => setIsLikeStatus(dat.id, false)}>Dislike</button>
                        <button onClick={() => updateData(dat.id)}>Vote</button>
                        <div>Results</div>
                        <div>Likes: {dat.likes} ({getPercent(dat.likes, (dat.likes + dat.dislikes))} %)</div>
                        <div>dislikes: {dat.dislikes} ({getPercent(dat.dislikes, (dat.likes + dat.dislikes))} %)</div>
                    </div>
                );
        })}
        </div>
    );
}