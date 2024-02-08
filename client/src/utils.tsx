import { Box, Paper, Popper, Typography } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';
import React from 'react';

export function extractDateAndTime(date: string | undefined) {
  if (!date) {
    return { dateString: '', timeString: '' };
  }
  const dateObj = new Date(date);
  const dateString = dateObj.toLocaleDateString();
  const timeString = dateObj.toLocaleTimeString().substring(0, 5); // remove seconds
  return { dateString, timeString };
}

// utility function for rendering data grid columns
interface GridCellExpandProps {
  value: string;
  width: number;
}

function isOverflown(element: Element): boolean {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

const GridCellExpand = React.memo(function GridCellExpand(
  props: GridCellExpandProps,
) {
  const { width, value } = props;
  const wrapper = React.useRef<HTMLDivElement | null>(null);
  const cellDiv = React.useRef(null);
  const cellValue = React.useRef(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [showFullCell, setShowFullCell] = React.useState(false);
  const [showPopper, setShowPopper] = React.useState(false);

  const handleMouseEnter = () => {
    const isCurrentlyOverflown = isOverflown(cellValue.current!);
    setShowPopper(isCurrentlyOverflown);
    setAnchorEl(cellDiv.current);
    setShowFullCell(true);
  };

  const handleMouseLeave = () => {
    setShowFullCell(false);
  };

  React.useEffect(() => {
    if (!showFullCell) {
      return undefined;
    }

    function handleKeyDown(nativeEvent: KeyboardEvent) {
      // IE11, Edge (prior to using Bink?) use 'Esc'
      if (nativeEvent.key === 'Escape' || nativeEvent.key === 'Esc') {
        setShowFullCell(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setShowFullCell, showFullCell]);

  return (
    <Box
      ref={wrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        alignItems: 'center',
        lineHeight: '24px',
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
      }}
    >
      <Box
        ref={cellDiv}
        sx={{
          height: '100%',
          width,
          display: 'block',
          position: 'absolute',
          top: 0,
        }}
      />
      <Box
        ref={cellValue}
        className="data-grid-cell"
        sx={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {value}
      </Box>
      {showPopper && (
        <Popper
          open={showFullCell && anchorEl !== null}
          anchorEl={anchorEl}
          style={{ width, marginLeft: -17 }}
        >
          <Paper
            elevation={1}
            style={{ minHeight: wrapper.current!.offsetHeight - 3 }}
          >
            <Typography variant="body2" style={{ padding: 8 }}>
              {value}
            </Typography>
          </Paper>
        </Popper>
      )}
    </Box>
  );
});

export function renderCellExpand(params: GridRenderCellParams<any, string>) {
  return (
    <GridCellExpand
      value={params.value || ''}
      width={params.colDef.computedWidth}
    />
  );
}

// get age (in years) from date of birth
export function getAge(dateString: string) {
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// capitalize only first letter of each word
export function capitalizeFirstLetter(s: string) {
  return s.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
}

// replace _ with ' ' and capitalize first letter of each word
export function formatEnum(s: string) {
  return capitalizeFirstLetter(s.split('_').join(' '));
}

// assumes date is in the past
export function getDifferenceInMonths(date: Date): number {
  const currrentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const givenMonth = date.getMonth();
  const givenYear = date.getFullYear();
  return (currentYear - givenYear) * 12 + currrentMonth - givenMonth;
}
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
export function getPastNMonths(n: number): string[] {
  const today = new Date().getMonth() - 1;
  const currentYear = new Date().getFullYear();
  const pastMonths = [];
  for (let i = 0; i < n; i++) {
    pastMonths.push(
      months[(today - i + 12) % 12] +
        ' ' +
        (today - i < 0 ? currentYear - 1 : currentYear),
    );
  }
  return pastMonths.reverse();
}
