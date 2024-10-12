import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchLocations, addLocation, updateLocation } from '../api/locations';
import { Save, MapPin, Phone, Mail, DollarSign, Info, FileText, Check } from 'lucide-react';

const LocationDetails: React.FC = () => {
  const { city, state } = useParams<{ city: string; state: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNewLocation = !city && !state;

  const [location, setLocation] = useState({
    officeName: '',
    city: '',
    state: '',
    market: '',
    lead: '',
    source: '',
    revenue: 0,
    ebitda: 0,
    ebitdaPercentage: 0,
    revenuePerProvider: 0,
    ev: 0,
    revenueMultiple: 0,
    ebitdaMultiple: 0,
    equityRollPercentage: 0,
    cashAtClose: 0,
    debtDrawAmount: 0,
    closeDate: '',
    integrationBurden: '',
    otherKeyDealTerms: '',
    notesStatus: '',
    datePassedDead: '',
    type: '',
    reason: '',
    logo: '',
    managerName: '',
    managerPhone: '',
    managerEmail: '',
    documents: {
      confidentialityAgreement: false,
      preliminaryInfoPackage: false,
      financialStatements: false,
      taxReturns: false,
      productionReports: false,
      accountsReceivable: false,
      revenueBreakdown: false,
      payrollRecords: false,
      debtSchedule: false,
      patientVolumeStats: false,
      patientDemographics: false,
      feeSchedules: false,
      equipmentInventory: false,
      officeManuals: false,
      technologySystems: false,
    },
  });

  const { data: locations } = useQuery({
    queryKey: ['locations'],
    queryFn: fetchLocations,
  });

  useEffect(() => {
    if (locations && !isNewLocation) {
      const existingLocation = locations.find(loc => loc.city === city && loc.state === state);
      if (existingLocation) {
        setLocation(prevLocation => ({
          ...prevLocation,
          ...existingLocation,
          documents: {
            ...prevLocation.documents,
            ...existingLocation.documents,
          },
        }));
      }
    }
  }, [locations, city, state, isNewLocation]);

  const mutation = useMutation({
    mutationFn: isNewLocation ? addLocation : updateLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      navigate('/locations');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(location);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocation(prev => ({ 
      ...prev, 
      [name]: e.target.type === 'number' ? Number(value) || 0 : value 
    }));
  };

  const handleDocumentChange = (documentName: string) => {
    setLocation(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [documentName]: !prev.documents[documentName],
      },
    }));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{isNewLocation ? 'Add New Location' : 'Edit Location'}</h1>
      
      {/* Location Info Hero Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            {location.logo ? (
              <img src={location.logo} alt="Location Logo" className="w-16 h-16 rounded-full mr-4" />
            ) : (
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                <MapPin className="h-8 w-8 text-gray-400" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold">{location.officeName || 'Office Name'}</h2>
              <p className="text-gray-500">{location.city || 'City'}, {location.state || 'State'}</p>
              <p className="text-gray-500">{location.market || 'Market'} Market</p>
              <div className="flex items-center mt-2">
                <DollarSign className="h-5 w-5 text-green-500 mr-1" />
                <span className="font-semibold text-green-500">${location.revenue.toLocaleString()} K</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <h3 className="font-semibold">{location.managerName || 'Location Manager'}</h3>
            <p className="flex items-center justify-end text-gray-600">
              <Phone className="h-4 w-4 mr-1" />
              {location.managerPhone || 'N/A'}
            </p>
            <p className="flex items-center justify-end text-gray-600">
              <Mail className="h-4 w-4 mr-1" />
              {location.managerEmail || 'N/A'}
            </p>
            <div className="flex items-center justify-end mt-2">
              <Info className="h-5 w-5 text-blue-500 mr-1" />
              <span className="font-semibold text-blue-500">{location.notesStatus || 'No Status'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Document Tracking Hero Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Document Collection Tracking</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <DocumentCheckbox
            label="Confidentiality Agreement"
            checked={location.documents.confidentialityAgreement}
            onChange={() => handleDocumentChange('confidentialityAgreement')}
          />
          <DocumentCheckbox
            label="Preliminary Info Package"
            checked={location.documents.preliminaryInfoPackage}
            onChange={() => handleDocumentChange('preliminaryInfoPackage')}
          />
          <DocumentCheckbox
            label="Financial Statements"
            checked={location.documents.financialStatements}
            onChange={() => handleDocumentChange('financialStatements')}
          />
          <DocumentCheckbox
            label="Tax Returns"
            checked={location.documents.taxReturns}
            onChange={() => handleDocumentChange('taxReturns')}
          />
          <DocumentCheckbox
            label="Production Reports"
            checked={location.documents.productionReports}
            onChange={() => handleDocumentChange('productionReports')}
          />
          <DocumentCheckbox
            label="Accounts Receivable"
            checked={location.documents.accountsReceivable}
            onChange={() => handleDocumentChange('accountsReceivable')}
          />
          <DocumentCheckbox
            label="Revenue Breakdown"
            checked={location.documents.revenueBreakdown}
            onChange={() => handleDocumentChange('revenueBreakdown')}
          />
          <DocumentCheckbox
            label="Payroll Records"
            checked={location.documents.payrollRecords}
            onChange={() => handleDocumentChange('payrollRecords')}
          />
          <DocumentCheckbox
            label="Debt Schedule"
            checked={location.documents.debtSchedule}
            onChange={() => handleDocumentChange('debtSchedule')}
          />
          <DocumentCheckbox
            label="Patient Volume Stats"
            checked={location.documents.patientVolumeStats}
            onChange={() => handleDocumentChange('patientVolumeStats')}
          />
          <DocumentCheckbox
            label="Patient Demographics"
            checked={location.documents.patientDemographics}
            onChange={() => handleDocumentChange('patientDemographics')}
          />
          <DocumentCheckbox
            label="Fee Schedules"
            checked={location.documents.feeSchedules}
            onChange={() => handleDocumentChange('feeSchedules')}
          />
          <DocumentCheckbox
            label="Equipment Inventory"
            checked={location.documents.equipmentInventory}
            onChange={() => handleDocumentChange('equipmentInventory')}
          />
          <DocumentCheckbox
            label="Office Manuals"
            checked={location.documents.officeManuals}
            onChange={() => handleDocumentChange('officeManuals')}
          />
          <DocumentCheckbox
            label="Technology Systems"
            checked={location.documents.technologySystems}
            onChange={() => handleDocumentChange('technologySystems')}
          />
        </div>
      </div>

      {/* Comprehensive form */}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Office Name" name="officeName" value={location.officeName} onChange={handleInputChange} />
          <InputField label="City" name="city" value={location.city} onChange={handleInputChange} />
          <InputField label="State" name="state" value={location.state} onChange={handleInputChange} />
          <InputField label="Market" name="market" value={location.market} onChange={handleInputChange} />
          <InputField label="Lead" name="lead" value={location.lead} onChange={handleInputChange} />
          <InputField label="Source" name="source" value={location.source} onChange={handleInputChange} />
          <InputField label="Revenue ($K)" name="revenue" value={location.revenue} onChange={handleInputChange} type="number" />
          <InputField label="EBITDA ($K)" name="ebitda" value={location.ebitda} onChange={handleInputChange} type="number" />
          <InputField label="EBITDA %" name="ebitdaPercentage" value={location.ebitdaPercentage} onChange={handleInputChange} type="number" />
          <InputField label="Revenue / Provider" name="revenuePerProvider" value={location.revenuePerProvider} onChange={handleInputChange} type="number" />
          <InputField label="EV" name="ev" value={location.ev} onChange={handleInputChange} type="number" />
          <InputField label="Revenue Multiple" name="revenueMultiple" value={location.revenueMultiple} onChange={handleInputChange} type="number" />
          <InputField label="EBITDA Multiple" name="ebitdaMultiple" value={location.ebitdaMultiple} onChange={handleInputChange} type="number" />
          <InputField label="Equity Roll %" name="equityRollPercentage" value={location.equityRollPercentage} onChange={handleInputChange} type="number" />
          <InputField label="Cash at Close" name="cashAtClose" value={location.cashAtClose} onChange={handleInputChange} type="number" />
          <InputField label="Debt Draw Amount" name="debtDrawAmount" value={location.debtDrawAmount} onChange={handleInputChange} type="number" />
          <InputField label="Close Date" name="closeDate" value={location.closeDate} onChange={handleInputChange} type="date" />
          <InputField label="Integration Burden" name="integrationBurden" value={location.integrationBurden} onChange={handleInputChange} />
          <InputField label="Other Key Deal Terms" name="otherKeyDealTerms" value={location.otherKeyDealTerms} onChange={handleInputChange} />
          <InputField label="Notes/Status" name="notesStatus" value={location.notesStatus} onChange={handleInputChange} />
          <InputField label="Date Passed / Dead" name="datePassedDead" value={location.datePassedDead} onChange={handleInputChange} type="date" />
          <InputField label="Type" name="type" value={location.type} onChange={handleInputChange} />
          <InputField label="Reason" name="reason" value={location.reason} onChange={handleInputChange} />
          <InputField label="Logo URL" name="logo" value={location.logo} onChange={handleInputChange} />
          <InputField label="Manager Name" name="managerName" value={location.managerName} onChange={handleInputChange} />
          <InputField label="Manager Phone" name="managerPhone" value={location.managerPhone} onChange={handleInputChange} />
          <InputField label="Manager Email" name="managerEmail" value={location.managerEmail} onChange={handleInputChange} type="email" />
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Save className="h-5 w-5 mr-2" />
            {isNewLocation ? 'Add Location' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

interface InputFieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, value, onChange, type = 'text' }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
    />
  </div>
);

interface DocumentCheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

const DocumentCheckbox: React.FC<DocumentCheckboxProps> = ({ label, checked, onChange }) => (
  <div className="flex items-center">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
    />
    <label className="ml-2 block text-sm text-gray-900">
      {checked ? <Check className="h-5 w-5 text-green-500 inline mr-1" /> : <FileText className="h-5 w-5 text-gray-400 inline mr-1" />}
      {label}
    </label>
  </div>
);

export default LocationDetails;