// src/features/volumeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../config';
import api from '../../axiosInstance';

export const getWorkflowId = createAsyncThunk(
    'guided/getWorkflowId',
    async ({ patientId, studyId ,volumeId}, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('ACCESS_TOKEN');
        if (!token) {
          throw new Error('No access token found');
        }
  
        const response = await api.post(
          `${BASE_URL}/api/workflow`,
          { patientId, studyId }, // Include patientId and studyId in the request body
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'volume-id': volumeId // Include volumeId in the headers
            }
          }
        );
        return response.data;
      } catch (error) {
        return rejectWithValue('Failed to fetch workflow id');
      }
    }
  );

  export const saveWorkflowId = createAsyncThunk(
    'guided/saveWorkflowId',
    async ({ volumeId, payload }, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('ACCESS_TOKEN');
        if (!token) {
          throw new Error('No access token found');
        }
  
        const response = await api.put(
          `${BASE_URL}/api/volume/${volumeId}`, // Use volumeId in the URL
          payload, // Send the entire payload in the request body
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json' // Ensure the content type is JSON
            }
          }
        );
  
        return response.data;
      } catch (error) {
        return rejectWithValue('Failed to save workflow id');
      }
    }
  );

 
export const getWorkflow = createAsyncThunk(
    'guided/getWorkflow',
    async (credentials, { rejectWithValue }) => {
        const { workflowId , volumeId} = credentials; 
      try {
        const token = localStorage.getItem('ACCESS_TOKEN');
        if (!token) {
          throw new Error('No access token found');
        }

        const response = await api.get(`${BASE_URL}/api/workflow/${workflowId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'volume-id': volumeId // Include volumeId in the headers
          }
        });
  
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );

  export const preprocessData = createAsyncThunk(
    'guided/preprocess',
    async ({ formData, workflowId , volumeId}, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('ACCESS_TOKEN');
        if (!token) {
          throw new Error('No access token found');
        }
  
        const response = await api.patch(`${BASE_URL}/api/workflow/preprocess/${workflowId}`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'volume-id': volumeId 
          }
        });
  
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );

  export const abdominalVolume = createAsyncThunk(
    'guided/abdominalVolume',
    async ({ formData, workflowId , volumeId}, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('ACCESS_TOKEN');
        if (!token) {
          throw new Error('No access token found');
        }
  
        const response = await api.patch(`${BASE_URL}/api/workflow/abdominal_volume/${workflowId}`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'volume-id': volumeId
          }
        });
  
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );

  export const defects = createAsyncThunk(
    'guided/defects',
    async ({ formData, workflowId , volumeId}, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('ACCESS_TOKEN');
        if (!token) {
          throw new Error('No access token found');
        }
  
        const response = await api.patch(`${BASE_URL}/api/workflow/defects/${workflowId}`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'volume-id': volumeId
          }
        });
  
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );

  export const fascial_muscle_analysis = createAsyncThunk(
    'guided/fascialmuscleanalysis',
    async ({ formData, workflowId , volumeId}, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('ACCESS_TOKEN');
        if (!token) {
          throw new Error('No access token found');
        }
  
        const response = await api.patch(`${BASE_URL}/api/workflow/fascial_muscle_analysis/${workflowId}`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'volume-id': volumeId
          }
        });
  
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );

  export const mesh_analysis = createAsyncThunk(
    'guided/meshanalysis',
    async ({ formData, workflowId , volumeId}, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('ACCESS_TOKEN');
        if (!token) {
          throw new Error('No access token found');
        }
  
        const response = await api.patch(`${BASE_URL}/api/workflow/mesh_analysis/${workflowId}`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'volume-id': volumeId
          }
        });
  
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );

  export const psoas_compute = createAsyncThunk(
    'guided/psoascompute',
    async ({ formData, workflowId , volumeId}, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('ACCESS_TOKEN');
        if (!token) {
          throw new Error('No access token found');
        }
  
        const response = await api.patch(`${BASE_URL}/api/workflow/psoas_compute/${workflowId}`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'volume-id': volumeId
          }
        });
  
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );

  export const completeWorkflow = createAsyncThunk(
    'guided/complete',
    async (credentials, { rejectWithValue }) => {
      const { workflowId , volumeId} = credentials; 
      try {
        const token = localStorage.getItem('ACCESS_TOKEN');
        if (!token) {
          throw new Error('No access token found');
        }
  
        const response = await api.post(
          `${BASE_URL}/api/workflow/${workflowId}/$complete`, 
          {}, // Empty object for request body
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'volume-id': volumeId, // Include volumeId in the headers
              'Content-Type': 'application/json', // Ensure the content type is JSON
            }
          }
        );
  
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );

  export const terminateWorkflow = createAsyncThunk(
    'guided/terminate',
    async ({ workflowId, volumeId }, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('ACCESS_TOKEN');
        if (!token) {
          throw new Error('No access token found');
        }
        const response = await api.post(
          `${BASE_URL}/api/workflow/${workflowId}/$terminate`, 
          {}, // Empty object for request body
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'volume-id': volumeId, // Include volumeId in the headers
              'Content-Type': 'application/json', // Ensure the content type is JSON
            }
          }
        );
  
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );



  const guidedSlice = createSlice({
    name: 'guided',
    initialState: {
      data: [],
      loading: false,
      error: null
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(getWorkflowId.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(getWorkflowId.fulfilled, (state, action) => {
          state.loading = false;
          state.data = action.payload;
        })
        .addCase(getWorkflowId.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        });
    }
  });
  
  export default guidedSlice.reducer;