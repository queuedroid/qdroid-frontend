import { Box, Typography, IconButton, Collapse, Divider, Paper, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { CopyOutlined, EyeOutlined } from '@ant-design/icons';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

function createData(date, MSISDN, reciever, message, status) {
  return { date, MSISDN, reciever, message, status };
}

const rows = [
  createData('11/03/2025', '+123456789', '+987654321', 'hello world', 'delivered'),
  createData('11/03/2025', '+123456789', '+234012345678', 'hello world', 'delivered'),
  createData('12/03/2025', '+123456789', '+122334455', 'hello world', 'failed'),
  createData('13/03/2025', '+123456789', '+111000222', 'hello world', 'pending'),
  createData('13/03/2025', '+123456789', '+987654321', 'hello world', 'delivered')
];

function BannerImage() {
  const [open, setOpen] = useState(true);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, staggerChildren: 0.15 } }
  };

  const paperVariants = {
    hidden: { opacity: 0, y: 40, rotate: -6 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      rotate: [i === 0 ? -3 : i === 1 ? 2.5 : -2, i === 0 ? 0 : i === 1 ? 0 : 0],
      transition: { type: 'spring', stiffness: 80, damping: 16, delay: i * 0.6 }
    })
  };

  const boxVariants = {
    hidden: { opacity: 0, scale: 0.7, rotate: -10 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      rotate: i === 0 ? 10 : i === 1 ? -8 : 14,
      transition: { type: 'spring', stiffness: 120, damping: 18, delay: 0.9 + i * 0.12 }
    })
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ width: '100%' }}>
      <Box
        sx={{
          width: '100%',
          maxWidth: '100%',
          minHeight: 220,
          //bgcolor: '#e3eaf6',
          background: 'none',
          display: 'flex',
          flexDirection: 'column',
          p: 4,
          position: 'relative',
          overflow: 'visible'
          //border: '1px solid #ececec',
          //boxShadow: 2
        }}
      >
        {/* Decorative tilted boxes with animation */}
        <motion.div
          custom={0}
          variants={boxVariants}
          initial="hidden"
          animate="visible"
          style={{
            position: 'absolute',
            top: 0,
            right: -22,
            width: 32,
            height: 32,
            zIndex: 1
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              bgcolor: '#E38E05',
              borderRadius: 2,
              boxShadow: 1
            }}
          />
        </motion.div>

        {/* Animated Papers */}
        <motion.div custom={0} variants={paperVariants} initial="hidden" animate="visible">
          <Paper
            sx={{
              p: 2,
              my: 3,
              //bgcolor: '#0069D3',
              transform: 'rotate(-3deg)',
              boxShadow: 4
            }}
          >
            {/* <Typography variant="subtitle1" sx={{ p: 2, fontWeight: 'bold' }}>
          API ACESS
        </Typography> */}
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#f0f0f0', borderRadius: 1 }}>
              <Typography variant="subtitle2" sx={{ p: 2 }}>
                AyKtn_sYeEJdniPNdft_dEXihlWqQLXC
              </Typography>
              <IconButton>
                <CopyOutlined />
              </IconButton>
            </Box>
          </Paper>
        </motion.div>
        <motion.div custom={1} variants={paperVariants} initial="hidden" animate="visible">
          <Paper
            sx={{
              p: 2,
              py: 3,
              transform: 'rotate(2.5deg)',
              boxShadow: 3,
              my: 3
            }}
          >
            <Chip
              sx={{
                borderRadius: 7,
                bgcolor: '#E3F2FD',
                color: '#1565C0',
                border: '1.5px solid #1565C0',
                mr: 1
              }}
              label="Accessible API"
            />
            <Chip
              sx={{
                borderRadius: 7,
                bgcolor: '#FFF3E0',
                color: '#EF6C00',
                border: '1.5px solid #EF6C00',
                mr: 1
              }}
              label="Open Source"
            />
            <Chip
              sx={{
                borderRadius: 7,
                bgcolor: '#E8F5E9',
                color: '#2E7D32',
                border: '1.5px solid #2E7D32',
                mr: 1
              }}
              label="Queue Management"
            />
            <Chip
              sx={{
                borderRadius: 7,
                bgcolor: '#F3E5F5',
                color: '#6A1B9A',
                border: '1.5px solid #6A1B9A'
              }}
              label="Plugin Support"
            />
          </Paper>
        </motion.div>
        <motion.div custom={2} variants={paperVariants} initial="hidden" animate="visible">
          <Paper
            sx={{
              p: 2,
              my: 3,
              transform: 'rotate(-2deg)',
              boxShadow: 2
            }}
          >
            {/* <Typography variant="subtitle1" sx={{ p: 2, fontWeight: 'bold' }}>
          MESSAGE QUEING
        </Typography> */}
            <TableContainer component={Paper}>
              <Table size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">MSISDN</TableCell>
                    <TableCell align="right">Reciever</TableCell>
                    <TableCell align="right">Message</TableCell>
                    <TableCell align="right">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.date} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row">
                        {row.date}
                      </TableCell>
                      <TableCell align="right">{row.MSISDN}</TableCell>
                      <TableCell align="right">{row.reciever}</TableCell>
                      <TableCell align="right">
                        <EyeOutlined />
                      </TableCell>
                      <TableCell align="right">{row.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </motion.div>
      </Box>
    </motion.div>
  );
}

export default BannerImage;
