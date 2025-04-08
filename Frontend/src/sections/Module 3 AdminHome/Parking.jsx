import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Car, Plus, X, Search, BarChart2, Edit, Trash2 } from 'lucide-react';
import "./styles/Parking.css";

const API_BASE_URL = 'http://localhost:8080';

function ParkingManagement() {
    const [parkingData, setParkingData] = useState([]);
    const [blocks, setBlocks] = useState(['A', 'B', 'C']); 
    const [showAddForm, setShowAddForm] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBlock, setSelectedBlock] = useState('all');
    const [newParking, setNewParking] = useState({
        parkingId: '',
        block: 'A',
        flatNo: '',
        residentName: '',
        isOccupied: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);

    // Fetch parking data and extract blocks
    useEffect(() => {
      const fetchData = async () => {
          try {
              setIsLoading(true);
              const response = await axios.get(`${API_BASE_URL}/api/parking`);
              setParkingData(response.data);
              
              // Extract unique blocks from parking data and combine with defaults
              const uniqueBlocks = [...new Set(response.data.map(item => item.block))];
              const allBlocks = [...new Set([...blocks, ...uniqueBlocks])]; // Combine defaults with data
              setBlocks(allBlocks);
          } catch (error) {
              setError('Failed to load parking data');
              console.error('Error:', error);
          } finally {
              setIsLoading(false);
          }
      };
      fetchData();
  }, []);

    // Calculate statistics
    const calculateStats = () => {
        const stats = {};
        
        // Calculate stats per block
        blocks.forEach(block => {
            const blockData = parkingData.filter(item => item.block === block);
            stats[block] = {
                total: blockData.length,
                occupied: blockData.filter(item => item.isOccupied).length,
                available: blockData.filter(item => !item.isOccupied).length,
                percentage: blockData.length > 0 ? 
                    Math.round((blockData.filter(item => item.isOccupied).length / blockData.length * 100)) : 0
            };
        });
        
        // Overall stats
        stats.all = {
            total: parkingData.length,
            occupied: parkingData.filter(item => item.isOccupied).length,
            available: parkingData.filter(item => !item.isOccupied).length,
            percentage: parkingData.length > 0 ? 
                Math.round((parkingData.filter(item => item.isOccupied).length / parkingData.length) * 100) : 0
        };
        
        return stats;
    };

    const stats = calculateStats();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewParking(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmitParking = async (e) => {
      e.preventDefault();
      try {
          setIsLoading(true);
          if (editingId) {
              // Update existing parking - using PUT method
              const response = await axios.put(
                  `${API_BASE_URL}/api/parking/${editingId}`,
                  {
                      ...newParking,
                      id: editingId // Ensure the ID is included in the body if your backend expects it
                  }
              );
              setParkingData(parkingData.map(item => item.id === editingId ? response.data : item));
          } else {
              // Add new parking - using POST method
              const response = await axios.post(`${API_BASE_URL}/api/parking`, newParking);
              setParkingData([...parkingData, response.data]);
          }
          setShowAddForm(false);
          resetForm();
      } catch (error) {
        console.error('Detailed error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            config: error.config
        });
        setError(error.response?.data?.message || 
                (editingId ? 'Failed to update parking space' : 'Failed to add parking space'));
    } finally {
          setIsLoading(false);
      }
  };

  const handleDelete = async (id) => {
    try {
        await axios.delete(`${API_BASE_URL}/api/parking/${id}`);
        setParkingData(prevData => prevData.filter(item => item.id !== id)); // Use functional update
    } catch (error) {
        setError('Failed to delete parking space');
        console.error('Detailed error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            config: error.config
        });
    }
};

    const handleEdit = (parking) => {
        setNewParking({
            parkingId: parking.parkingId,
            block: parking.block,
            flatNo: parking.flatNo,
            residentName: parking.residentName,
            isOccupied: parking.isOccupied
        });
        setEditingId(parking.id);
        setShowAddForm(true);
    };

    const resetForm = () => {
        setNewParking({
            parkingId: '',
            block: 'A',
            flatNo: '',
            residentName: '',
            isOccupied: false
        });
        setEditingId(null);
    };

    const filteredData = parkingData.filter(item => {
        const matchesSearch = item.parkingId.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             (item.residentName && item.residentName.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesBlock = selectedBlock === 'all' || item.block === selectedBlock;
        return matchesSearch && matchesBlock;
    });

    return (
        <div className="parking-container">
            <div className="parking-header">
                <h1><Car size={24} /> Parking Management</h1>
                <div className="header-actions">
                    <button 
                        onClick={() => setShowAddForm(true)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center gap-2"
                    >
                        <Plus size={16} /> Add Space
                    </button>
                    <button 
                        onClick={() => setShowStats(!showStats)}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center gap-2"
                    >
                        <BarChart2 size={16} /> {showStats ? 'Hide Stats' : 'Show Stats'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                    <button onClick={() => setError(null)}>Dismiss</button>
                </div>
            )}

            {isLoading && <div className="loading-spinner">Loading...</div>}

            {showStats && (
                <div className="stats-container">
                    <h2>Parking Utilization</h2>
                    <div className="stats-grid">
                        {['all', ...blocks].map((block, index) => (
                            <div key={`${block}-${index}`} className="stat-card">
                                <h3>{block === 'all' ? 'All Blocks' : `Block ${block}`}</h3>
                                <p>Total Spaces: {stats[block]?.total || 0}</p>
                                <p>Occupied: {stats[block]?.occupied || 0}</p>
                                <p>Available: {stats[block]?.available || 0}</p>
                                <div className="progress-bar">
                                    <div 
                                        className="progress-fill" 
                                        style={{ width: `${stats[block]?.percentage || 0}%` }}
                                    ></div>
                                </div>
                                <p>{stats[block]?.percentage || 0}% occupied</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="controls">
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search by ID or resident..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <select 
                    value={selectedBlock} 
                    onChange={(e) => setSelectedBlock(e.target.value)}
                    className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">All Blocks</option>
                    {blocks.map(block => (
                        <option key={block} value={block}>Block {block}</option>
                    ))}
                </select>
            </div>

            <div className="parking-grid">
                {filteredData.length > 0 ? (
                    filteredData.map(item => (
                        <div key={item.id} className={`parking-card ${item.isOccupied ? 'occupied' : 'available'}`}>
                            <div className="card-header">
                                <h3>{item.parkingId}</h3>
                                <span className={`status-badge ${item.isOccupied ? 'occupied' : 'available'}`}>
                                    {item.isOccupied ? 'Occupied' : 'Available'}
                                </span>
                            </div>
                            <p>Block: {item.block}</p>
                            <p>Flat: {item.flatNo}</p>
                            {item.residentName && <p>Resident: {item.residentName}</p>}
                            <div className="card-actions flex gap-2 mt-3">
                <button 
                    className="edit-btn border border-white-600 text-white-500 hover:bg-blue-700 hover:text-white p-1 rounded transition-colors duration-200"
                    onClick={() => handleEdit(item)}
                >
                    <Edit size={14} />
                </button>
                <button 
                    className="delete-btn border border-red-500 text-red-500 hover:bg-red-500 hover:text-white p-1 rounded transition-colors duration-200"
                    onClick={() => handleDelete(item.id)} /* Changed from item._id to item.id */
                >
                    <Trash2 size={14} />
                </button>
            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-results">
                        <p>No parking spaces found matching your criteria.</p>
                    </div>
                )}
            </div>

            {showAddForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{editingId ? 'Edit Parking Space' : 'Add New Parking Space'}</h2>
                            <button 
                                onClick={() => {
                                    setShowAddForm(false);
                                    resetForm();
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmitParking}>
                            <div className="form-group">
                                <label>Parking ID</label>
                                <input
                                    type="text"
                                    name="parkingId"
                                    value={newParking.parkingId}
                                    onChange={handleInputChange}
                                    required
                                    pattern="P-[A-Za-z0-9]+"
                                    title="Format: P- followed by alphanumeric characters"
                                    className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="form-group">
                                <label>Block</label>
                                <select
                                    name="block"
                                    value={newParking.block}
                                    onChange={handleInputChange}
                                    required
                                    className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {blocks.map(block => (
                                        <option key={block} value={block}>{block}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Flat Number</label>
                                <input
                                    type="text"
                                    name="flatNo"
                                    value={newParking.flatNo}
                                    onChange={handleInputChange}
                                    required
                                    className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="form-group">
                                <label>Resident Name</label>
                                <input
                                    type="text"
                                    name="residentName"
                                    value={newParking.residentName}
                                    onChange={handleInputChange}
                                    className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="form-group checkbox">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="isOccupied"
                                        checked={newParking.isOccupied}
                                        onChange={(e) => setNewParking({...newParking, isOccupied: e.target.checked})}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    Occupied
                                </label>
                            </div>
                            <div className="form-actions flex justify-end gap-3 mt-4">
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setShowAddForm(false);
                                        resetForm();
                                    }}
                                    disabled={isLoading}
                                    className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Saving...' : (editingId ? 'Update Parking' : 'Add Parking')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ParkingManagement;