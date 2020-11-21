import React from 'react';

const SelectStatus = ({ defaultValue }) => (
  <select name="status" defaultValue={defaultValue || 'ACTIVE'} style={{ flexBasis: '50%' }}>
    <option value="ACTIVE">ACTIVE</option>
    <option value="INACTIVE">INACTIVE</option>
    <option value="FINISHED">FINISHED</option>
  </select>
);

export default SelectStatus;
