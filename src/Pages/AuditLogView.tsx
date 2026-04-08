import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface AuditLog {
    id: number;
    action: string;
    details: string;
    performedBy: string;
    timestamp: string;
}

const AuditLogView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [logs, setLogs] = useState<AuditLog[]>([]);

    useEffect(() => {
        // Mock data fetching based on the ID
        const mockLogs: AuditLog[] = [
            { id: 1, action: 'Project Created', details: 'Initial project setup', performedBy: 'Admin', timestamp: new Date().toLocaleString() },
            { id: 2, action: 'User Story Added', details: 'Added "Login Feature" to backlog', performedBy: 'John Doe', timestamp: new Date().toLocaleString() },
            { id: 3, action: 'Status Update', details: 'Moved Story #12 to In Progress', performedBy: 'Jane Smith', timestamp: new Date().toLocaleString() },
        ];
        setLogs(mockLogs);
    }, [id]);

    return (
        <Box sx={{ p: 4, height: '100vh', bgcolor: '#dee4ff', overflowY: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={() => navigate(-1)} sx={{ mr: 2, bgcolor: 'white', '&:hover': { bgcolor: '#f5f5f5' } }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" component="h1" fontWeight="800" color="#0a0e33">
                    Audit Logs {id ? `- ID: ${id}` : ''}
                </Typography>
            </Box>

            <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Log ID</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Action</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Details</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Performed By</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Timestamp</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {logs.map((log) => (
                            <TableRow key={log.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell>{log.id}</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#334155' }}>{log.action}</TableCell>
                                <TableCell>{log.details}</TableCell>
                                <TableCell>{log.performedBy}</TableCell>
                                <TableCell sx={{ color: '#64748b', fontSize: '0.875rem' }}>{log.timestamp}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default AuditLogView;