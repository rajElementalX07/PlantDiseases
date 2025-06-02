import React, { useEffect, useState } from 'react'
import { Button, Container, Image, Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { getError } from '../utils/getError';
import api from '../utils/axios';
import { MdDelete } from 'react-icons/md';
import toast from 'react-hot-toast';

function History() {

    const {user,token} = useSelector((state) => state.user);
    const [data,setData] = useState([]);

    const getHistory = async()=>{
        try {
            const response = await api.get('/api/farmer/plant',{
                headers:{
                    Authorization: token,
                }
            })

            console.log(response);
            const{data} =response.data;
            console.log(data)
            setData(data);

        } catch (error) {
            getError(error);
        }
    }


    const handleHistoryDelete = async(id)=>{
        try {
            const response = await api.delete(`/api/farmer/delete-history/${id}`,{
                headers:{
                    Authorization: token,
                }
            })
               
               console.log(response);
                // dispatch(setUser({user:farmer})); 
            toast.success("Plant History Deleted")
            getHistory();

        } catch (error) {
            getError(error)
        }
    }


    useEffect(()=>{
        getHistory();
    },[])

  return (
    <section className="d-flex justify-content-center align-items-center custom-section py-5">
    <Container className="p-3 rounded-4 glass-morf">
      <h5 className="my-3 text-center fw-bold">
      Plant History
      </h5>
      {data?.length > 0 ? <Table borderless variant='transparent' > 
        <thead style={{background:'transparent'}}>
            <tr>
                <td>Sr.no</td>
                <td>Description</td>
                <td>data</td>
                <td>Image</td>
                <td>Action</td>
            </tr>
        </thead>
        <tbody style={{background:'transparent'}}>
       { data?.map((history,index) => (
        <tr key={index} style={{background:'transparent'}}>
           <td>{index+1}</td> 
          <td>{history?.description}</td>
          <td>{new Date(history?.createdAt).toLocaleDateString()}</td>
         <td> <Image src={history?.image} style={{maxHeight:'3rem'}} /></td>
         <td><Button variant='transparent' onClick={()=>handleHistoryDelete(history?._id)}><MdDelete size={20} color='red' /></Button></td>
        </tr>
      ))
       }
    

        </tbody>
      </Table>
      :
      <p className='text-center'>No Plant History</p>
      }
     
    </Container>
  </section>
  )
}

export default History