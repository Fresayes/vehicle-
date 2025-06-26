import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  ComposedChart,
} from "recharts";

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
];

const VehicleDataDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [data, setData] = useState({});
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });

  // Enhanced data loading function
  const loadCSVData = async () => {
    try {
      const files = {
        vehicles: "vehicles.csv",
        makes: "makes.csv",
        models: "models.csv",
        colors: "colors.csv",
        features: "features.csv",
        fuelTypes: "fuel-types.csv",
        transmissionTypes: "transmission-types.csv",
        trims: "trims.csv",
        vehicleDocuments: "vechicle-documents.csv",
        vehicleColors: "vehicle-colors.csv",
        vehicleFeatures: "vehicle-features.csv",
      };

      const loadedData = {};
      for (const [key, filename] of Object.entries(files)) {
        console.log(`Loading ${filename}...`);
        const response = await fetch(filename);
        const text = await response.text();
        loadedData[key] = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
        }).data;
        console.log(`Loaded ${filename}, got ${loadedData[key].length} records`);
      }
      setData(loadedData);
      console.log("All data loaded:", loadedData);
    } catch (error) {
      console.error("Error loading CSV data:", error);
    }
  };

  useEffect(() => {
    loadCSVData();
  }, []);

  // Sorting function
  const sortData = (vehicles) => {
    if (!sortConfig.key) return vehicles;

    return [...vehicles].sort((a, b) => {
      const aDetails = getVehicleDetails(a.id);
      const bDetails = getVehicleDetails(b.id);

      let aValue, bValue;

      switch (sortConfig.key) {
        case 'make':
          aValue = aDetails.make;
          bValue = bDetails.make;
          break;
        case 'model':
          aValue = aDetails.model;
          bValue = bDetails.model;
          break;
        case 'year':
          aValue = parseInt(a.year);
          bValue = parseInt(b.year);
          break;
        case 'price':
          aValue = parseFloat(a.price);
          bValue = parseFloat(b.price);
          break;
        case 'mileage':
          aValue = parseFloat(a.mileage);
          bValue = parseFloat(b.mileage);
          break;
        case 'transmission':
          aValue = aDetails.transmission;
          bValue = bDetails.transmission;
          break;
        case 'fuelType':
          aValue = aDetails.fuelType;
          bValue = bDetails.fuelType;
          break;
        default:
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Enhanced data processing functions
  const getVehicleDetails = (vehicleId) => {
    if (!data.vehicles) return null;

    const vehicle = data.vehicles.find((v) => v.id === vehicleId);
    if (!vehicle) return null;

    const make =
      data.makes?.find((m) => m.id === vehicle.make_id)?.name || "Unknown Make";
    const model =
      data.models?.find((m) => m.id === vehicle.model_id)?.name ||
      "Unknown Model";
    const trim =
      data.trims?.find((t) => t.id === vehicle.trim_id)?.name || "Unknown Trim";
    const fuelType =
      data.fuelTypes?.find((f) => f.id === vehicle.fuel_type_id)?.name ||
      "Unknown Fuel Type";
    const transmission =
      data.transmissionTypes?.find((t) => t.id === vehicle.transmission_type_id)
        ?.name || "Unknown Transmission";

    const colors =
      data.vehicleColors
        ?.filter((vc) => vc.vehicle_id === vehicleId)
        ?.map((vc) => data.colors?.find((c) => c.id === vc.color_id)?.name)
        ?.filter(Boolean) || [];

    const features =
      data.vehicleFeatures
        ?.filter((vf) => vf.vehicle_id === vehicleId)
        ?.map((vf) => data.features?.find((f) => f.id === vf.feature_id)?.name)
        ?.filter(Boolean) || [];

    const documents =
      data.vehicleDocuments?.filter((doc) => doc.vehicle_id === vehicleId) ||
      [];

    return {
      ...vehicle,
      make,
      model,
      trim,
      fuelType,
      transmission,
      colors,
      features,
      documents,
    };
  };

  const renderInventoryTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
        <h3 className="text-xl font-semibold mb-4">Vehicle Inventory</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                onClick={() => requestSort('make')}
              >
                Make {sortConfig.key === 'make' && (
                  <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                onClick={() => requestSort('model')}
              >
                Model {sortConfig.key === 'model' && (
                  <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                onClick={() => requestSort('year')}
              >
                Year {sortConfig.key === 'year' && (
                  <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                onClick={() => requestSort('price')}
              >
                Price {sortConfig.key === 'price' && (
                  <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                onClick={() => requestSort('mileage')}
              >
                Mileage {sortConfig.key === 'mileage' && (
                  <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                onClick={() => requestSort('transmission')}
              >
                Transmission {sortConfig.key === 'transmission' && (
                  <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                onClick={() => requestSort('fuelType')}
              >
                Fuel Type {sortConfig.key === 'fuelType' && (
                  <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                )}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortData(data.vehicles || [])?.map((vehicle, index) => {
              const details = getVehicleDetails(vehicle.id);
              return (
                <tr
                  key={vehicle.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {details.make}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {details.model}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {vehicle.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${Number(vehicle.price).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {Number(vehicle.mileage).toLocaleString()} mi
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {details.transmission}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {details.fuelType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedVehicle(details)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedVehicle && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start">
              <h3 className="text-2xl font-bold">
                {selectedVehicle.year} {selectedVehicle.make}{" "}
                {selectedVehicle.model}
              </h3>
              <button
                onClick={() => setSelectedVehicle(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Basic Information</h4>
                <dl className="grid grid-cols-1 gap-2">
                  <div>
                    <dt className="text-gray-600">Price</dt>
                    <dd className="font-medium">
                      ${Number(selectedVehicle.price).toLocaleString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-600">Mileage</dt>
                    <dd className="font-medium">
                      {Number(selectedVehicle.mileage).toLocaleString()} mi
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-600">Trim</dt>
                    <dd className="font-medium">{selectedVehicle.trim}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-600">Transmission</dt>
                    <dd className="font-medium">
                      {selectedVehicle.transmission}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-600">Fuel Type</dt>
                    <dd className="font-medium">{selectedVehicle.fuelType}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Colors</h4>
                <ul className="list-disc list-inside">
                  {selectedVehicle.colors.map((color, index) => (
                    <li key={index}>{color}</li>
                  ))}
                </ul>

                <h4 className="font-semibold mt-4 mb-2">Features</h4>
                <ul className="list-disc list-inside">
                  {selectedVehicle.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-semibold mb-2">Documents</h4>
              <ul className="list-disc list-inside">
                {selectedVehicle.documents.map((doc, index) => (
                  <li key={index}>
                    {doc.document_type} - {doc.document_number}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderColorsTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Vehicle Colors Distribution</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={getColorStats()}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {getColorStats().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
        <h3 className="text-xl font-semibold mb-4">Colors List</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Color Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Number of Vehicles
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {getColorStats().map((color, index) => (
              <tr
                key={color.name}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-6 py-4 whitespace-nowrap">{color.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{color.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTransmissionsTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Transmission Types Distribution</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getTransmissionStats()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Number of Vehicles" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
        <h3 className="text-xl font-semibold mb-4">Transmission Types List</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Transmission Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Number of Vehicles
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {getTransmissionStats().map((transmission, index) => (
              <tr
                key={transmission.name}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  {transmission.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {transmission.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTrimsTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Vehicle Trims Distribution</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getTrimStats()} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Number of Vehicles" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
        <h3 className="text-xl font-semibold mb-4">Trims List</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Trim Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Number of Vehicles
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {getTrimStats().map((trim, index) => (
              <tr
                key={trim.name}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-6 py-4 whitespace-nowrap">{trim.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{trim.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDocumentsTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Document Types Distribution</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getDocumentStats()} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Number of Documents" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
        <h3 className="text-xl font-semibold mb-4">Documents List</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Document Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Count
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Latest Issue Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {getDocumentStats().map((doc, index) => {
              // Find the latest issue date for this document type
              const latestDoc = data.vehicleDocuments
                .filter(d => d.document_type === doc.name)
                .sort((a, b) => new Date(b.issue_date) - new Date(a.issue_date))[0];
              
              return (
                <tr
                  key={doc.name}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-4 whitespace-nowrap">{doc.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{doc.value}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {latestDoc?.issue_date ? new Date(latestDoc.issue_date).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
        <h3 className="text-xl font-semibold mb-4">Recent Documents</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Vehicle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Document Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Issue Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Expiry Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.vehicleDocuments
              ?.sort((a, b) => new Date(b.issue_date) - new Date(a.issue_date))
              .slice(0, 10)
              .map((doc, index) => {
                const vehicle = data.vehicles?.find(v => v.id === doc.vehicle_id);
                const make = vehicle ? data.makes?.find(m => m.id === vehicle.make_id)?.name : 'Unknown';
                const model = vehicle ? data.models?.find(m => m.id === vehicle.model_id)?.name : 'Unknown';
                
                return (
                  <tr
                    key={`${doc.vehicle_id}-${doc.document_type}-${index}`}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {vehicle ? `${make} ${model} (${vehicle.year})` : 'Unknown Vehicle'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {doc.document_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {doc.issue_date ? new Date(doc.issue_date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {doc.expiry_date ? new Date(doc.expiry_date).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Data processing functions
  const getMakeStats = () => {
    if (!data.vehicles || !data.makes) return [];

    const makeCount = data.vehicles.reduce((acc, vehicle) => {
      const make =
        data.makes.find((m) => m.id === vehicle.make_id)?.name || "Unknown";
      acc[make] = (acc[make] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(makeCount).map(([make, count]) => ({ make, count }));
  };

  const getPriceStats = () => {
    if (!data.vehicles) return [];

    const priceRanges = {
      "0-10k": 0,
      "10k-20k": 0,
      "20k-30k": 0,
      "30k-40k": 0,
      "40k+": 0,
    };

    data.vehicles.forEach((vehicle) => {
      const price = parseFloat(vehicle.price);
      if (price <= 10000) priceRanges["0-10k"]++;
      else if (price <= 20000) priceRanges["10k-20k"]++;
      else if (price <= 30000) priceRanges["20k-30k"]++;
      else if (price <= 40000) priceRanges["30k-40k"]++;
      else priceRanges["40k+"]++;
    });

    return Object.entries(priceRanges).map(([range, count]) => ({
      range,
      count,
    }));
  };

  const getFuelTypeStats = () => {
    if (!data.vehicles || !data.fuelTypes) return [];

    const fuelTypeCount = data.vehicles.reduce((acc, vehicle) => {
      const fuelType =
        data.fuelTypes.find((ft) => ft.id === vehicle.fuel_type_id)?.name ||
        "Unknown";
      acc[fuelType] = (acc[fuelType] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(fuelTypeCount).map(([type, count]) => ({
      type,
      count,
    }));
  };

  const getModelStats = () => {
    if (!data.vehicles || !data.models) return [];

    const modelCount = data.vehicles.reduce((acc, vehicle) => {
      const model =
        data.models.find((m) => m.id === vehicle.model_id)?.name || "Unknown";
      acc[model] = (acc[model] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(modelCount)
      .map(([model, count]) => ({ model, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  };

  const getColorStats = () => {
    if (!data.colors || !data.vehicleColors) {
      console.log("Missing data for colors stats:", { colors: !!data.colors, vehicleColors: !!data.vehicleColors });
      return [];
    }

    const colorCount = data.vehicleColors.reduce((acc, vc) => {
      const color =
        data.colors.find((c) => c.id === vc.color_id)?.name || "Unknown";
      acc[color] = (acc[color] || 0) + 1;
      return acc;
    }, {});

    const result = Object.entries(colorCount).map(([name, value]) => ({ name, value }));
    console.log("Color stats:", result);
    return result;
  };

  const getTransmissionStats = () => {
    if (!data.vehicles || !data.transmissionTypes) {
      console.log("Missing data for transmission stats:", { vehicles: !!data.vehicles, transmissionTypes: !!data.transmissionTypes });
      return [];
    }

    const transmissionCount = data.vehicles.reduce((acc, vehicle) => {
      const transmission =
        data.transmissionTypes.find(
          (t) => t.id === vehicle.transmission_type_id
        )?.name || "Unknown";
      acc[transmission] = (acc[transmission] || 0) + 1;
      return acc;
    }, {});

    const result = Object.entries(transmissionCount).map(([name, value]) => ({
      name,
      value,
    }));
    console.log("Transmission stats:", result);
    return result;
  };

  const getTrimStats = () => {
    if (!data.vehicles || !data.trims) {
      console.log("Missing data for trim stats:", { vehicles: !!data.vehicles, trims: !!data.trims });
      return [];
    }

    const trimCount = data.vehicles.reduce((acc, vehicle) => {
      const trim =
        data.trims.find((t) => t.id === vehicle.trim_id)?.name || "Unknown";
      acc[trim] = (acc[trim] || 0) + 1;
      return acc;
    }, {});

    const result = Object.entries(trimCount).map(([name, value]) => ({
      name,
      value,
    }));
    console.log("Trim stats:", result);
    return result;
  };

  const getDocumentStats = () => {
    if (!data.vehicleDocuments) {
      console.log("Missing vehicle documents data");
      return [];
    }

    // Group documents by type and count them
    const documentTypes = data.vehicleDocuments.reduce((acc, doc) => {
      const type = doc.document_type || "Unknown";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    // Convert to array format needed for charts
    const result = Object.entries(documentTypes)
      .map(([name, value]) => ({
        name,
        value
      }))
      .sort((a, b) => b.value - a.value); // Sort by count in descending order

    console.log("Document stats:", result);
    return result;
  };

  const renderOverviewTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Vehicles by Make</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={getMakeStats()}
              dataKey="count"
              nameKey="make"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {getMakeStats().map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Price Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={getPriceStats()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Fuel Type Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={getFuelTypeStats()}
              dataKey="count"
              nameKey="type"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {getFuelTypeStats().map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Top 10 Models</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={getModelStats()} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="model" type="category" width={150} />
            <Tooltip />
            <Bar dataKey="count" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Vehicle Inventory Dashboard
        </h1>

        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "overview"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("inventory")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "inventory"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Inventory
          </button>
          <button
            onClick={() => setActiveTab("colors")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "colors"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Colors
          </button>
          <button
            onClick={() => setActiveTab("transmissions")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "transmissions"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Transmissions
          </button>
          <button
            onClick={() => setActiveTab("trims")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "trims"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Trims
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "documents"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Documents
          </button>
        </div>

        {activeTab === "overview" && renderOverviewTab()}
        {activeTab === "inventory" && renderInventoryTab()}
        {activeTab === "colors" && renderColorsTab()}
        {activeTab === "transmissions" && renderTransmissionsTab()}
        {activeTab === "trims" && renderTrimsTab()}
        {activeTab === "documents" && renderDocumentsTab()}
      </div>
    </div>
  );
};

export default VehicleDataDashboard;
