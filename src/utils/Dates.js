import dayjs from 'dayjs';

const createYMDDate = (date) => {
  if (date && dayjs(date).isValid()) {
    const year = dayjs(date).get('y');
    const day = dayjs(date).get('date');
    let month = dayjs(date).get('month');
    month++
    return `${year}-${month}-${day}`;
  }
  else {
    const year = dayjs().get('y');
    const day = dayjs().get('date');
    let month = dayjs().get('month');
    month++
    return `${year}-${month}-${day}`;
  }
}

const createDMYDate = (date) => {
  if (!date) {
    const Year = dayjs().get('y');
    const Month = dayjs().get('M');
    const Day = dayjs().get('date');
    return `${Day}/${Month}/${Year}`
  }
  else {
    const Year = dayjs(date).get('y');
    const Month = dayjs(date).get('M');
    const Day = dayjs(date).get('date');
    return `${Day}/${Month}/${Year}`
  }
}


export { createYMDDate, createDMYDate }
