import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import Checkbox from '@mui/material/Checkbox';
import {Box, Button, InputBase } from "@mui/material";

export default function BasicTable() {
    const [page, setPage] = useState(0);
    const [data, setData] = useState(null);
    const [filteredData, setFilteredData] = useState(data);
    const [rowsPerPage, setRowsPerPage] = useState(10); 
    const [search, setSearch] = useState('')
    const [selectedRows, setSelectedRows] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleCheckboxChange = (event, id) => {
        if (event.target.checked) {
            setSelectedRows([...selectedRows, id]);
        } else {
            setSelectedRows(selectedRows.filter(rowId => rowId !== id));
        }
    };

    const handleDeleteSelectedRows = () => {
        const updatedData = data.filter((row) => !selectedRows.includes(row.id));    
        setData(updatedData);
        setFilteredData(updatedData);
        setSelectedRows([]);
    };
    
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        const searchResult = data.filter((data) => 
            data.name.toLowerCase().includes(e.target.value.toLowerCase()) || 
            data.email.toLowerCase().includes(e.target.value.toLowerCase()) ||
            data.role.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(searchResult);
        setSelectedRows([]);
    };

    const handleClearSearch = () => {
        setSearch('');
        setFilteredData(data);
    }

    const fetchData = async () => {
        try {
            const response = await fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const result = await response.json();
            setData(result);
            setFilteredData(result);
        } catch (error) {
            console.error('Error fetching data:', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Box p='10px 50px'>
            <Box 
                style={{
                    boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
                    backgroundColor: 'white',
                    margin: '10px 0',
                    borderRadius: '10px',
                    display: "flex",
                    padding: "20px 50px",
                    justifyContent: "space-between"
                }}
            >
                <Box
                    display='flex'
                    width="250px"
                    borderBottom='1px solid #d0d8e8'
                    padding="0.1rem 1rem"
                    >
                    <InputBase 
                        onChange={handleSearch}
                        value={search}
                        placeholder="Search..." 
                    />
                    <Button className='button' onClick={handleClearSearch}>Clear</Button>
                </Box>
                <Button onClick={handleDeleteSelectedRows} disabled={selectedRows.length === 0}>Delete Selected</Button>
            </Box>


            {loading ? (
                <div>Loading...</div>
            ) : (
                <TableContainer 
                    sx={{
                        boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
                        borderRadius: '10px',
                        
                    }}
                    component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="table">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Checkbox
                                        indeterminate={selectedRows.length > 0 && selectedRows.length < data.length}
                                        checked={selectedRows.length === data?.length}
                                        onChange={(event) => {
                                            if (event.target.checked) {
                                                setSelectedRows(data?.map((row) => row.id) || []);
                                            } else {
                                                setSelectedRows([]);
                                            }
                                        }}
                                    />
                                </TableCell>
                                <TableCell sx={{fontWeight:'600', color : "grey"}} align="left">Name</TableCell>
                                <TableCell sx={{fontWeight:'600', color : "grey"}} align="left">Email</TableCell>
                                <TableCell sx={{fontWeight:'600', color : "grey"}} align="left">Role</TableCell>
                                <TableCell sx={{fontWeight:'600', color : "grey"}} align="left">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData && filteredData
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => (
                                    <TableRow height="10px" key={row.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedRows.includes(row.id)}
                                                onChange={(event) => handleCheckboxChange(event, row.id)}
                                            />
                                        </TableCell>
                                        <TableCell align="left">{row.name}</TableCell>
                                        <TableCell align="left">{row.email}</TableCell>
                                        <TableCell align="left">{row.role}</TableCell>
                                        <TableCell align="left">{row.id}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {
                data && (
                    <div>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 50]}
                            component="div"
                            count={data.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </div>
                )
            }
        </Box>
    );
}

