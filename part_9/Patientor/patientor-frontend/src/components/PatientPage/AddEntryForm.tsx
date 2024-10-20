import { useState as useInternalState, SyntheticEvent as Event } from "react";
import {
  Box as Container,
  Button as ClickableButton,
  FormControl as FormWrapper,
  Grid as ItemGrid,
  InputLabel as Label,
  MenuItem as DropdownItem,
  Select as Dropdown,
  TextField as InputField,
  Typography as HeadingText,
} from "@mui/material";
import { Diagnosis as MedicalCode, EntryFormValues as FormValues, EntryType as RecordType } from "../../types";

interface AddRecordFormProps {
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
  recordType: RecordType | undefined;
  medicalCodes: MedicalCode[];
}

const AddRecordForm = ({ onSubmit, onCancel, recordType, medicalCodes }: AddRecordFormProps) => {
  const [description, setDescription] = useInternalState<string>("");
  const [date, setDate] = useInternalState<string>("");
  const [specialist, setSpecialist] = useInternalState<string>("");
  const [healthRating, setHealthRating] = useInternalState<number>(0);
  const [employer, setEmployer] = useInternalState<string>("");
  const [leaveStart, setLeaveStart] = useInternalState<string>("");
  const [leaveEnd, setLeaveEnd] = useInternalState<string>("");
  const [dischargeDate, setDischargeDate] = useInternalState<string>("");
  const [dischargeCriteria, setDischargeCriteria] = useInternalState<string>("");
  const [selectedCodes, setSelectedCodes] = useInternalState<string[]>([]);

  const healthRatingOptions = [
    { value: 0, label: "Healthy" },
    { value: 1, label: "Low risk" },
    { value: 2, label: "High risk" },
    { value: 3, label: "Critical risk" },
  ];

  const addRecord = (event: Event) => {
    event.preventDefault();
    switch (recordType) {
      case RecordType.HealthCheck:
        onSubmit({
          type: RecordType.HealthCheck,
          description,
          date,
          specialist,
          healthCheckRating: healthRating,
          diagnosisCodes: selectedCodes,
        });
        break;
      case RecordType.Hospital:
        onSubmit({
          type: RecordType.Hospital,
          description,
          date,
          specialist,
          discharge: {
            date: dischargeDate,
            criteria: dischargeCriteria,
          },
          diagnosisCodes: selectedCodes,
        });
        break;
      case RecordType.OccupationalHealthcare:
        let sickLeave = undefined;
        if (leaveStart || leaveEnd) {
          sickLeave = {
            startDate: leaveStart,
            endDate: leaveEnd,
          };
        }
        onSubmit({
          type: RecordType.OccupationalHealthcare,
          description,
          date,
          specialist,
          employerName: employer,
          sickLeave,
          diagnosisCodes: selectedCodes,
        });
        break;
      default:
        throw new Error("Unknown record type");
    }
  };

  return (
    <Container sx={{ border: "2px dashed grey", borderRadius: 2, padding: 2, mt: 2 }}>
      <HeadingText variant="h6">New {recordType} entry</HeadingText>
      <form onSubmit={addRecord}>
        <InputField
          sx={{ my: 1 }}
          label="Description"
          variant="standard"
          fullWidth
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />
        <InputField
          sx={{ my: 1 }}
          type="date"
          label="Date"
          variant="standard"
          fullWidth
          value={date}
          onChange={({ target }) => setDate(target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <InputField
          sx={{ my: 1 }}
          label="Specialist"
          variant="standard"
          fullWidth
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
        />
        {recordType === RecordType.HealthCheck && (
          <InputField
            sx={{ my: 1 }}
            select
            label="Health check rating"
            variant="standard"
            fullWidth
            value={healthRating}
            onChange={({ target }) =>
              setHealthRating(parseInt(target.value))
            }
          >
            {healthRatingOptions.map((option) => (
              <DropdownItem key={option.value} value={option.value}>
                {option.label}
              </DropdownItem>
            ))}
          </InputField>
        )}
        {recordType === RecordType.OccupationalHealthcare && (
          <>
            <InputField
              sx={{ my: 1 }}
              label="Employee"
              variant="standard"
              fullWidth
              value={employer}
              onChange={({ target }) => setEmployer(target.value)}
            />
            <InputField
              sx={{ my: 1 }}
              type="date"
              label="Sick leave start date"
              variant="standard"
              fullWidth
              value={leaveStart}
              onChange={({ target }) => setLeaveStart(target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <InputField
              sx={{ my: 1 }}
              type="date"
              label="Sick leave end date"
              variant="standard"
              fullWidth
              value={leaveEnd}
              onChange={({ target }) => setLeaveEnd(target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </>
        )}
        {recordType === RecordType.Hospital && (
          <>
            <InputField
              sx={{ my: 1 }}
              type="date"
              label="Discharge date"
              variant="standard"
              fullWidth
              value={dischargeDate}
              onChange={({ target }) => setDischargeDate(target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <InputField
              sx={{ my: 1 }}
              label="Discharge criteria"
              variant="standard"
              fullWidth
              value={dischargeCriteria}
              onChange={({ target }) => setDischargeCriteria(target.value)}
            />
          </>
        )}
        <FormWrapper sx={{ my: 1 }} variant="standard" fullWidth>
          <Label>Diagnosis codes</Label>
          <Dropdown
            multiple
            value={selectedCodes}
            onChange={({ target }) =>
              setSelectedCodes(typeof target.value === "string" ? target.value.split(',') : target.value)
            }
          >
            {medicalCodes.map((medicalCode) => (
              <DropdownItem key={medicalCode.code} value={medicalCode.code}>
                {medicalCode.code} {medicalCode.name}
              </DropdownItem>
            ))}
          </Dropdown>
        </FormWrapper>
        <ItemGrid sx={{ pb: 4 }}>
          <ItemGrid item>
            <ClickableButton
              color="warning"
              variant="contained"
              style={{ float: "left" }}
              type="button"
              onClick={onCancel}
            >
              Cancel
            </ClickableButton>
          </ItemGrid>
          <ItemGrid item>
            <ClickableButton
              style={{
                float: "right",
              }}
              type="submit"
              variant="contained"
            >
              Add
            </ClickableButton>
          </ItemGrid>
        </ItemGrid>
      </form>
    </Container>
  );
};

export default AddRecordForm;
