import { useState as useInternalState, useEffect as useInternalEffect } from "react";
import { useParams as getParams } from "react-router-dom";
import axios from "axios";
import { Alert as WarningMessage, Box as Container, Button as Clickable, ButtonGroup as ClickableGroup, Stack as ItemStack, CircularProgress as LoadingSpinner, Typography as TextDisplay } from "@mui/material";
import { Work as JobIcon, LocalHospital as HospitalIcon, HealthAndSafety as HealthSafetyIcon, Favorite as HeartIcon, Male as MaleIcon, Female as FemaleIcon } from '@mui/icons-material';
import AddEntryForm from "./AddEntryForm";
import patientService from "../../services/patients";
import { Diagnosis as MedicalCode, Patient as Person, Entry as Record, EntryFormValues as RecordFormValues, EntryType as RecordType } from "../../types";


// Props for the Patient Page
interface PersonPageProps {
  medicalCodes: MedicalCode[];
}

// Props for Entry Details Component
interface RecordDetailsProps {
  medicalCodes: MedicalCode[];
  record: Record;
}

// Props for Diagnosis List
interface MedicalCodeListProps {
  medicalCodes: MedicalCode[];
  record: Record;
}

// HealthRatingBar props
interface HealthStatusBarProps {
  status: number;
}

// Health Status component
const HealthStatusBar = ({ status }: HealthStatusBarProps) => {
  switch (status) {
    case 0:
      return <HeartIcon style={{color: "#00cc00"}}/>;
    case 1:
      return <HeartIcon style={{color: "#ffff00"}}/>;
    case 2:
      return <HeartIcon style={{color: "#ff6600"}}/>;
    case 3:
      return <HeartIcon style={{color: "#ff0000"}}/>;
    default:
      return null;
  }
};

// Diagnosis List Component
const MedicalCodeList = ({medicalCodes, record}: MedicalCodeListProps) => {
  if (!record.diagnosisCodes || record.diagnosisCodes.length === 0) return null;

  return (
    <ul>
      {record.diagnosisCodes?.map(code => (
        <li key={code}>
          {code} {medicalCodes.find(medicalCode => medicalCode.code === code)?.name}
        </li>
      ))}
    </ul>
  );
};

// Entry Details Component
const RecordDetails = ({ medicalCodes, record }: RecordDetailsProps ) => {
  switch (record.type) {
    case RecordType.Hospital:
      return (
      <div>
        <TextDisplay variant="body1">
          {record.date} <HospitalIcon />
        </TextDisplay>
        <TextDisplay variant="body1">
          <em>{record.description}</em>
        </TextDisplay>
        <TextDisplay variant="body1">
          Discharge: {record.discharge.date} {record.discharge.criteria}
        </TextDisplay>
        <MedicalCodeList medicalCodes={medicalCodes} record={record} />
        <TextDisplay variant="body1">
          diagnosed by {record.specialist}
        </TextDisplay>
      </div>
      );
    case RecordType.HealthCheck:
      return (
        <div>
          <TextDisplay variant="body1">
            {record.date} <HealthSafetyIcon />
          </TextDisplay>
          <TextDisplay variant="body1">
            <em>{record.description}</em>
          </TextDisplay>
          <HealthStatusBar status={record.healthCheckRating} />
          <MedicalCodeList medicalCodes={medicalCodes} record={record} />
          <TextDisplay variant="body1">
            diagnosed by {record.specialist}
          </TextDisplay>
        </div>
      );
    case RecordType.OccupationalHealthcare:
      return (
        <div>
          <TextDisplay variant="body1">
            {record.date} <JobIcon /> {record.employerName}
          </TextDisplay>
          <TextDisplay variant="body1">
            <em>{record.description}</em>
          </TextDisplay>
          {record.sickLeave && (
            <TextDisplay variant="body1">
              Sick Leave: {record.sickLeave.startDate} - {record.sickLeave.endDate}
            </TextDisplay>
          )}
          <MedicalCodeList medicalCodes={medicalCodes} record={record} />
          <TextDisplay variant="body1">
            diagnosed by {record.specialist}
          </TextDisplay>
        </div>
      );
    
  }
};

// Patient Page Component
const PersonPage = ({ medicalCodes }: PersonPageProps) => {
  const [loading, setLoading] = useInternalState(true);
  const [person, setPerson] = useInternalState<Person>();
  const [error, setError] = useInternalState<string>();
  const { id } = getParams<{ id: string }>();
  const [showForm, setShowForm] = useInternalState<boolean>(false);
  const [showEntryOptions, setShowEntryOptions] = useInternalState<boolean>(false);
  const [recordType, setRecordType] = useInternalState<RecordType>();

  useInternalEffect(() => {
    const fetchPerson = async () => {
      try {
        const person = await patientService.getById(id);
        setPerson(person);
        setLoading(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    };
    fetchPerson();
  }, [id]);

  const toggleForm = () => {
    setShowForm(!showForm);
    setError(undefined);
  };

  const handleSelectingRecordType = (recordType: RecordType) => {
    setRecordType(recordType);
    setShowEntryOptions(false);
    setShowForm(true);
  };

  const submitNewRecord = async (values: RecordFormValues) => {
    try {
      const person = await patientService.addEntry(id, values);
      setPerson(person);
      toggleForm();
    }
    catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if(e?.response?.data?.Error && typeof e?.response?.data.Error === "string") {
          const message = e.response.data.Error;
          console.error(message);
          setError(message);
        } else {
          setError("Unrecognized axios error");
        }
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

  if (loading) {
    return (
      <Container
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="30vh"
      >
        <LoadingSpinner />
      </Container>
    );
  }

  if (!person) {
    return (
      <div>
        <Container sx={{ mt: 4 }} >
          <TextDisplay variant="h5">
            Person not found
          </TextDisplay>
        </Container>
      </div>
    );
  }

  return (
    <div>
        <Container sx={{ mt: 4 }} >
          <TextDisplay variant="h5" sx={{ mb: 3 }}>
            {person.name}
            {person.gender === "male" && <MaleIcon />}
            {person.gender === "female" && <FemaleIcon />}
          </TextDisplay>
          <TextDisplay variant="body1">
            ssn: {person.ssn}
          </TextDisplay>
          <TextDisplay variant="body1">
            occupation: {person.occupation}
          </TextDisplay>
          {error && <WarningMessage severity="error">{error}</WarningMessage>}
          {!showForm && showEntryOptions &&(
            <ClickableGroup variant="text" aria-label="text button group">
              <Clickable sx={{mt: 3}} onClick={() => handleSelectingRecordType(RecordType.HealthCheck)}>New HealthCheck entry</Clickable>
              <Clickable sx={{mt: 3}} onClick={() => handleSelectingRecordType(RecordType.Hospital)}>New Hospital entry</Clickable>
              <Clickable sx={{mt: 3}} onClick={() => handleSelectingRecordType(RecordType.OccupationalHealthcare)}>New OccupationalHealthcare entry</Clickable>
              <Clickable sx={{mt: 3}} onClick={() => setShowEntryOptions(false)}>Cancel</Clickable>
            </ClickableGroup>
          )}
          {!showForm && !showEntryOptions && (
            <Clickable sx={{mt: 3}} variant="contained" onClick={() => setShowEntryOptions(true)}>New entry</Clickable>
          )}
          {showForm && (
            <AddEntryForm onCancel={toggleForm} onSubmit={submitNewRecord} recordType={recordType} medicalCodes={medicalCodes}/>
          )}
          <TextDisplay variant="h6" sx={{ mt: 3, mb: 1 }}>
            entries
          </TextDisplay>
          {person.entries.map(record => (
            <ItemStack key={record.id} sx={{ border: 1, borderRadius: 2, padding: 2, my: 2 }}>
              <RecordDetails record={record} medicalCodes={medicalCodes} />
            </ItemStack>
          ))}
          {person.entries.length === 0 && (
            <TextDisplay variant="body1" sx={{ mt: 1 }}>
              no entries
            </TextDisplay>
          )}  
      </Container>
    </div>
  );
};

export default PersonPage;
