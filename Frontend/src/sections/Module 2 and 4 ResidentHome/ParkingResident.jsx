import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Car, Search, BarChart2 } from 'lucide-react';
import "./styles/ParkingResident.css";

const API_BASE_URL = 'http://localhost:8080';

function ResidentParking() {
    const [parkingData, setParkingData] = useState([]);
    const [blocks, setBlocks] = useState(['A', 'B', 'C']); 
    const [showStats, setShowStats] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBlock, setSelectedBlock] = useState('all');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch parking data and extract blocks
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`${API_BASE_URL}/api/parking`);
                setParkingData(response.data);

                // Extract unique blocks from parking data and combine with defaults
                const uniqueBlocks = [...new Set(response.data.map(item => item.block))];
                const allBlocks = [...new Set([...blocks, ...uniqueBlocks])];
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

    const filteredData = parkingData.filter(item => {
        const matchesSearch = item.parkingId.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           (item.residentName && item.residentName.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesBlock = selectedBlock === 'all' || item.block === selectedBlock;

        return matchesSearch && matchesBlock;
    });

    return (
        <div className="parking-container">
            <div className="parking-header">
                <h1><Car size={24} /> Resident Parking</h1>
                <div className="header-actions">
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
                        </div>
                    ))
                ) : (
                    <div className="no-results">
                        <p>No parking spaces found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ResidentParking;
