import React from 'react'
import {  Button, Container, Row, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { MdDelete } from 'react-icons/md';
import { getError } from '../utils/getError';
import api from '../utils/axios';
import { setUser } from '../features/userSlice';
import toast from 'react-hot-toast';

function Notifications() {

    const {user,token} = useSelector((state) => state.user);
    const dispatch = useDispatch();


    const handleNotificationDelete = async(index)=>{
        try {
            const response = await api.patch('/api/farmer/delete-notification',index,{
                headers:{
                    Authorization: token,
                }
            })
               const {farmer} = response.data;
               console.log(farmer);
                dispatch(setUser({user:farmer})); 
            toast.success("Notification Deleted")

        } catch (error) {
            getError(error)
        }
    }

  return (
    <section className="d-flex justify-content-center align-items-center custom-section py-5">
    <Container className="p-3 rounded-4 glass-morf">
      <h5 className="my-3 text-center fw-bold">
      Notifications
      </h5>
     {user?.notifications?.length>0?  <Table>
        <thead>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td>Action</td>
            </tr>
        </thead>
        <tbody>
        { user?.notifications?.map((notification,index) => (
        <tr key={index}>
          <td xs={1}>{index+1}</td>
          <td>{notification?.message}</td>
          <td>{new Date(notification?.createdAt).toLocaleDateString()}</td>
          <td><Button variant='transparent' onClick={()=>handleNotificationDelete(index)}><MdDelete size={20} color='red' /></Button></td>
        </tr>
      ))
        }
           
        </tbody>
      </Table>
      :
      <p className='text-center'>No Notifications</p>
        }
    </Container>
  </section>
  )
}

export default Notifications