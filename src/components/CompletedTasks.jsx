import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Alert, IconButton , Grid } from '@mui/material';
import { useDispatch } from 'react-redux';
import { getVolumes, downloadPDF, deleteVolume } from '../redux/slice/volumeSlice';
import GetAppIcon from '@mui/icons-material/GetApp';
import DeleteIcon from '@mui/icons-material/Delete';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import customtheme from '../theme';
import '../global1.css';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';

const CompletedTasks = () => {
  const [loading, setLoading] = useState(false);
  const [volumes, setVolumes] = useState([]);
  const [error, setError] = useState(false);
  const [pdfContent, setPdfContent] = useState(null);
  const [openPdfDialog, setOpenPdfDialog] = useState(false);
  const [reportNotFound, setReportNotFound] = useState(false);
  const [selectedVolumeId, setSelectedVolumeId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [page, setPage] = useState(0); // Page starts from 0
  const [pageSize, setPageSize] = useState(4); // Rows per page
  const [rowCount, setRowCount] = useState(0); // Total number of volumes
  // New state for pagination
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [previousPageUrl, setPreviousPageUrl] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    localStorage.removeItem('psoasComputeFormData');
    fetchVolumes(page, pageSize); // Updated to pass pagination parameters
  }, [page, pageSize]);

  const fetchVolumes = async (page, pageSize) => {
    setLoading(true);
    try {
      const response = await dispatch(getVolumes({ page, pageSize })).unwrap();
  
      // Extract the pagination data
      const { next, previous, count } = response;  // Destructure pagination info
  
      // Set next and previous page URLs based on response
      setNextPageUrl(next ? next : null);
      setPreviousPageUrl(previous ? previous : null);
  
      const transformedVolumes = response.results.map(volume => ({
        ...volume,
        report_generation_time: volume.report_meta && volume.report_meta.report_generation_time
          ? new Date(volume.report_meta.report_generation_time).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
          : 'N/A',
        isAutomated: volume.isAutomated ? 'Automated' : 'Guided',
      }));
  
      const completedVolumes = transformedVolumes.filter(volume => volume.status === 'COMPLETED');
      setVolumes(completedVolumes); // Update state with completed volumes
      setRowCount(response.count); // Update total row count
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };
  

  const CustomNoRowsOverlay = () => (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        fontSize: '1.5rem',
        color: 'gray',
      }}
    >
      No volumes found.
    </Box>
  );

  const handleDownload = async (row) => {
    try {
      const response = await dispatch(downloadPDF({ volume_id: row.volume_id })).unwrap();
      const reader = new FileReader();
      reader.onloadend = () => {
        setPdfContent(reader.result);
        setOpenPdfDialog(true);
      };
      reader.readAsDataURL(response);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setReportNotFound(true);
      } else {
        console.error("Error downloading PDF:", error);
        setReportNotFound(true);
      }
    }
  };

  const handleDeleteClick = (volumeId) => {
    setSelectedVolumeId(volumeId);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    setOpenDeleteDialog(false);
    await dispatch(deleteVolume({ volume_id: selectedVolumeId })).unwrap();
    fetchVolumes(page, pageSize); // Update fetch after deletion
  };

  
  const handleNextPage = () => {
    if (nextPageUrl && volumes.length >= pageSize) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (previousPageUrl) {
      setPage(page - 1);
    }
  };

  const columns = [
      /* { field: 'patient_id', headerName: 'Patient ID', flex: 1, minWidth: 150, headerClassName: 'header-class', headerStyle: { backgroundColor: customtheme.colors.primary, color: '#333' } },
    { field: 'study_id', headerName: 'Study ID', flex: 1, minWidth: 150, headerClassName: 'header-class', headerStyle: { backgroundColor: customtheme.colors.primary, color: '#333', fontSize: '18px' } },
    { field: 'patient_name', headerName: 'Patient Name', flex: 1, minWidth: 150, headerClassName: 'header-class', headerStyle: { backgroundColor: customtheme.colors.primary, color: '#333', fontSize: '18px' }, renderCell: (params) => <span>{params.row.volume_meta?.patient_name || '-'}</span> },
    { field: 'institution_id', headerName: 'Institution Name', flex: 1, minWidth: 150, headerClassName: 'header-class', headerStyle: { backgroundColor: '#f0f0f0', color: '#333', fontSize: '18px' }, renderCell: (params) => <span>{params.row.volume_meta?.institution_name || '-'}</span> },*/
    { field: 'report_generation_time', headerName: 'Exercise Date', flex: 1, minWidth: 150, headerClassName: 'header-class', headerStyle: { backgroundColor: '#f0f0f0', color: '#333' } },
    { field: 'status', headerName: 'Status', flex: 1, minWidth: 150, headerClassName: 'header-class', renderCell: (params) => {
     
      return (
        <Box width="100%">
            <Typography mt={2} variant="body2">COMPLETED</Typography>
        </Box>
      );
    }},
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      minWidth: 150,
      headerClassName: 'header-class',
      headerStyle: { backgroundColor: '#f0f0f0', color: '#333' },
      renderCell: (params) => {
        const { status } = params.row;

        return (
          <div>
            {(status === 'REVIEW' || status === 'COMPLETED') && (
              <IconButton aria-label="download" onClick={() => handleDownload(params.row)}>
                <GetAppIcon />
              </IconButton>
            )}
            <IconButton aria-label="delete" onClick={() => handleDeleteClick(params.row.volume_id)}>
              <DeleteIcon />
            </IconButton>
          </div>
        );
      },
    }
  ];

  const getRowId = (row) => row.volume_id; // Assuming 'volume_id' is unique for each row

  return (
    <Box height="100%" width="100%" display="flex" flexDirection="column" className="data-grid-wrapper">
      {loading ? (
        <CircularProgress style={{ margin: 'auto' }} />
      ) : error ? (
        <div>Error loading volumes</div>
      ) : (
        <Box height="100%" width="100%" display="flex" flexDirection="column">
         <DataGrid
        rows={volumes}
        columns={columns}
        pagination = {false}
        paginationMode="server"
        page={page}
        pageSize={pageSize}
        getRowId={getRowId}
        rowCount={rowCount}
        onPageChange={(newPage) => setPage(newPage)}
        onPageSizeChange={(newPageSize) => {
          setPageSize(newPageSize);
          setPage(0); // Reset to first page when page size changes
        }}
        autoHeight
       // Hide the default pagination controls
      />

     {/* Conditionally render pagination controls */}
{volumes.length > 0 && (
  <Grid container justifyContent="flex-end" alignItems="center" sx={{ marginTop: 2 }}>
    <IconButton
      onClick={handlePreviousPage}
      disabled={!previousPageUrl}
      sx={{ 
        fontSize: 'small', // Adjust icon size
        marginRight: 1,
        color: previousPageUrl ? 'default' : 'gray', // Set color based on availability
      }}
    >
      <ArrowBackIos fontSize="inherit" />
    </IconButton>
    <Typography sx={{ marginX: 1, fontSize: 'small' }}>{`Page ${page + 1}`}</Typography>
    <IconButton
      onClick={handleNextPage}
      disabled={!nextPageUrl || volumes.length < pageSize}
      sx={{ 
        fontSize: 'small', // Adjust icon size
        marginLeft: 1,
        color: nextPageUrl && volumes.length >= pageSize ? 'default' : 'gray', // Set color based on availability
      }}
    >
      <ArrowForwardIos fontSize="inherit" />
    </IconButton>
  </Grid>
)}
          <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogContent>
              <Typography>Are you sure you want to delete?</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
              <Button onClick={handleDeleteConfirm} variant="contained" color="error">Delete</Button>
            </DialogActions>
          </Dialog>
          <Dialog open={openPdfDialog} onClose={() => setOpenPdfDialog(false)} fullWidth maxWidth="xl" >
            <DialogContent>
              {pdfContent && <embed src={pdfContent} type="application/pdf" width="100%" height="1000" />}
            </DialogContent>
          </Dialog>
          <Dialog open={reportNotFound} onClose={() => setReportNotFound(false)}>
            <DialogTitle>Report Not Found</DialogTitle>
            <DialogContent>
              <Alert severity="error">The report for this task was not found.</Alert>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setReportNotFound(false)}>Close</Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </Box>
  );
};

export default CompletedTasks;
