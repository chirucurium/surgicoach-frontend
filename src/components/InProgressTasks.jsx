import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Container, Typography, CircularProgress, AppBar, Toolbar, IconButton, Select, MenuItem, Grid, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions, Button, Alert, Box, LinearProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getVolumes, downloadPDF, deleteVolume } from '../redux/slice/volumeSlice';
import { uploadVolume, uploadVolumeUpdate, refreshVolume } from '../redux/slice/volumeSlice';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import '../global1.css';
import CustomButton from './commonElements/CustomButton';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { getWorkflow, preprocessData } from '../redux/slice/guidedSlice';
import { useNavigate } from 'react-router-dom';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { styled } from '@mui/system';
import customtheme from '../theme';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import GetAppIcon from '@mui/icons-material/GetApp';

const CustomLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  width: 200,
  borderRadius: 5,
  [`&.MuiLinearProgress-root`]: {
    backgroundColor: 'white',
    border: '1px solid #ded6d5',
  },
  [`& .MuiLinearProgress-bar`]: {
    borderRadius: 5,
    backgroundColor: 'green',
  },
}));

const statusStepMapping = {
  DEFECT_ANALYSIS: { step: 1, label: 'Step 1 of 7 completed' },
  ABDOMINAL_VOLUME: { step: 2, label: 'Step 2 of 7 completed' },
  FASCIAL_MUSCLE_ANALYSIS: { step: 3, label: 'Step 3 of 7 completed' },
  MESH_ANALYSIS: { step: 4, label: 'Step 4 of 7 completed' },
  PSOAS_COMPUTATION: { step: 5, label: 'Step 5 of 7 completed' },
  SURGICAL_RECOMMENDATIONS: { step: 6, label: 'Step 6 of 7 completed' },
  REVIEW: { step: 7, label: 'Step 7 of 7 completed' },
};

const InProgressTasks = () => {
  const [loadingMap, setLoadingMap] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [volumes, setVolumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [reviewOnly, setReviewOnly] = useState(true);
  const [pdfContent, setPdfContent] = useState(null);
  const [openPdfDialog, setOpenPdfDialog] = useState(false);
  const [selectedVolumeId, setSelectedVolumeId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [reportNotFound, setReportNotFound] = useState(false);
  const [page, setPage] = useState(0); // Page starts from 0
  const [pageSize, setPageSize] = useState(5); // Rows per page
  const [rowCount, setRowCount] = useState(0); // Total number of volumes
  // New state for pagination
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [previousPageUrl, setPreviousPageUrl] = useState(null);
  const role = localStorage.getItem('role');

  useEffect(() => {
    localStorage.removeItem('psoasComputeFormData');
    fetchVolumes(page, pageSize); // Updated to pass pagination parameters
  }, [page, pageSize]);

  const fetchVolumes = async (page, pageSize) => {
    setLoading(true);
    try {
      const response = await dispatch(getVolumes({ page, pageSize })).unwrap(); // Pass page and pageSize as parameters

      // Extract the pagination data
      const { next, previous, count } = response;  // Destructure pagination info

      setNextPageUrl(next);
      setPreviousPageUrl(previous);
  
      const transformedVolumes = response.results.map(volume => ({
        ...volume,
        upload_date: new Date(volume.upload_date).toLocaleString('en-US', {
          year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
        }),
      }));

      const inProcessingVolumes = transformedVolumes.filter(volume => volume.status !== 'COMPLETED');

      setVolumes(inProcessingVolumes);
      setRowCount(count);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const getRowId = (row) => row.volume_id; // Assuming 'volume_id' is unique for each row

  const handleDeleteClick = (volumeId) => {
    setSelectedVolumeId(volumeId);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    setOpenDeleteDialog(false);
    await dispatch(deleteVolume({ volume_id: selectedVolumeId })).unwrap();
    fetchVolumes(page, pageSize); // Update fetch after deletion
  };

  const handleRefresh = async () => {
    //await dispatch(refreshVolume()).unwrap();
    const response = await dispatch(getVolumes({ page, pageSize })).unwrap(); // Pass page and pageSize as parameters
  };

  const handleNextPage = () => {
    if (nextPageUrl) {
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
    { field: 'upload_date', headerName: 'Exercise Date', flex: 1, minWidth: 150, headerClassName: 'header-class', headerStyle: { backgroundColor: '#f0f0f0', color: '#333' } },
    { field: 'status', headerName: 'Status', flex: 1, minWidth: 150, headerClassName: 'header-class', renderCell: (params) => {
     
      return (
        <Box width="100%">
         
            <Typography mt={2} variant="body2">In progress</Typography>
          
        </Box>
      );
    }},
    { field: 'actions', headerName: 'Actions', flex: 1, minWidth: 150, headerClassName: 'header-class', headerStyle: { backgroundColor: '#f0f0f0', color: '#333' }, renderCell: (params) => {
      const { status, isAutomated } = params.row;
      const isActionEnabled = (status === 'PSOAS_COMPUTATION' && role === 'SURGEON') || role !== 'SURGEON';
      return (
        <div>
      <IconButton aria-label="edit" onClick={() => handleEdit(params.row)}>
        <EditNoteIcon />
      </IconButton>
      <img src="../src/assets/Ricon.png" width="20" height="20" className="rimage"/>
      <IconButton aria-label="download">
        <GetAppIcon />
      </IconButton>
      <IconButton aria-label="delete" onClick={() => handleDeleteClick(params.row.volume_id)}>
        <DeleteIcon />
      </IconButton>
        </div>
      );
    }},
  ];

  return (
    <>
      <Grid item container justifyContent="flex-end">
        <CustomButton
          onClick={handleRefresh}
          type="button"
          sx={{
            width: "200px",
            height: "50px",
            backgroundColor: customtheme.colors.primary,
            fontWeight: "12px",
            display: "flex",
            alignItems: "center",
            marginBottom: '20px',
            color: customtheme.colors.white
          }}
        >
          <RefreshIcon sx={{ mr: 1 }} />
          Refresh
        </CustomButton>
      </Grid>
      <Box height="100%" width="100%" display="flex" flexDirection="column">
        {loading ? (
          <CircularProgress style={{ margin: 'auto' }} />
        ) : error ? (
          <Typography variant="body1" color="error" align="center">
            Error loading volumes
          </Typography>
        ) : (
          <>
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

{volumes.length > 0 && (
        <Grid container justifyContent="flex-end" alignItems="center" sx={{ marginTop: 2 }}>
          <IconButton
            onClick={handlePreviousPage}
            disabled={!previousPageUrl}
            sx={{ 
              fontSize: 'small', // Adjust icon size
              marginRight: 1,
            }}
          >
            <ArrowBackIos fontSize="inherit" />
          </IconButton>
          <Typography sx={{ marginX: 1, fontSize: 'small' }}>{`Page ${page + 1}`}</Typography>
          <IconButton
            onClick={handleNextPage}
            disabled={!nextPageUrl}
            sx={{ 
              fontSize: 'small', // Adjust icon size
              marginLeft: 1,
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
            <Dialog open={openPdfDialog} onClose={() => setOpenPdfDialog(false)} fullWidth maxWidth="xl">
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
          </>
        )}
      </Box>
    </>
  );
};

export default InProgressTasks;
