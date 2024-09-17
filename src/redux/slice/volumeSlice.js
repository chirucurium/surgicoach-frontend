// src/features/volumeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../config';
import api from '../../axiosInstance';

export const getVolumes = createAsyncThunk(
  'volumes/getVolumes',
  async ({ page, pageSize }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/volume`, {
        params: {
          sort: '-upload_date',
          page_size: pageSize,
          page: page + 1, // 1-based page index
        },
      });
      return response.data; // Return the API response data
    } catch (error) {
      return rejectWithValue('Failed to fetch volumes');
    }
  }
);

// Fetch volume by id
export const getVolumeById = createAsyncThunk(
  'volumes/getVolumeById',
  async (credentials, { rejectWithValue }) => {
    const { volume_id } = credentials;
    try {
      const response = await api.get(`/api/volume/${volume_id}`, {
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


// Download PDF
export const downloadPDF = createAsyncThunk(
  'volumes/downloadPDF',
  async (credentials, { rejectWithValue }) => {
    const { volume_id } = credentials;
    try {
      const response = await api.get(`/api/volume/${volume_id}?download=true`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete volume
export const deleteVolume = createAsyncThunk(
  'volumes/deleteVolume',
  async (credentials, { rejectWithValue }) => {
    const { volume_id } = credentials;
    try {
      const response = await api.delete(`/api/volume/${volume_id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Refresh volume
export const refreshVolume = createAsyncThunk(
  'volumes/refreshVolume',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/volume/refresh`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get membership data
export const getMemberShipData = createAsyncThunk(
  'membership/getMemberShipData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/user/profile?membership=true');
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);

// Get profile data
export const getProfileData = createAsyncThunk(
  'membership/getProfileData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/user/profile');
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);

// Upload volume
export const uploadVolume = createAsyncThunk(
  'upload/volume',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/volume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update volume status
export const uploadVolumeUpdate = createAsyncThunk(
  'upload/volume',
  async (credentials, { rejectWithValue }) => {
    const { volume_id, status } = credentials;
    try {
      const response = await api.patch(`/api/volume/${volume_id}`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const computeHdss = createAsyncThunk(
  'volume/compute',
  async ({ hdssData, volumeId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('ACCESS_TOKEN');
      if (!token) {
        throw new Error('No access token found');
      }
      const response = await api.post('/api/volume/$compute-hdss', hdssData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'volume-id': volumeId
        }
      });
      return response.data; // Ensure you return the correct data here
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

// PUT Upload volume
export const putUploadVolume = createAsyncThunk(
  'upload/putvolume',
  async (credentials, { rejectWithValue }) => {
    const { volume_id, ...rest } = credentials; // Extract volume_id and other data
    try {
      const response = await api.put(`/api/volume/${volume_id}`, rest); // Pass rest of the data as the body
      return response.data; // Ensure you're returning the data, not the full response
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);




  
  const volumeSlice = createSlice({
    name: 'volumes',
    initialState: {
      data: [],
      loading: false,
      error: null
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(getVolumes.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(getVolumes.fulfilled, (state, action) => {
          state.loading = false;
          state.data = action.payload;
        })
        .addCase(getVolumes.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        });
    }
  });
  
  export default volumeSlice.reducer;