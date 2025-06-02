import React from 'react'
import { Form } from 'react-bootstrap'

function FromField({label,type,placeholder,onChange,name,value,accept}) {
  return (
    <Form.Group className="mb-3 fw-bold"  >
        <Form.Label>{label}</Form.Label>
        <Form.Control required type={type} name={name} value={value} placeholder={placeholder} accept={accept} onChange={onChange} />
      </Form.Group>
  )
}

export default FromField