import React from 'react';

const SelectStatus = ({ defaultValue, disabled }) => (
  <select disabled={disabled} name="status" defaultValue={defaultValue || 'ACTIVE'} style={{ flexBasis: '50%' }}>
    <option value="ACTIVE">ACTIVE</option>
    <option value="INACTIVE">INACTIVE</option>
    <option value="FINISHED">FINISHED</option>
  </select>
);

export default SelectStatus;
