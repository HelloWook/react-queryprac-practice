export async function fetchEvents({ signal, serachTerm }) {
  let url = "http://localhost:3000/events";
  if (serachTerm) {
    url += "?search" + serachTerm;
  }
  // signal은 전송을 중단시키는 객체요소 이를 이용하여 시그널을 이용하여 전달을 중지한다
  // 리엑트 쿼리
  const response = await fetch(url, { signal: signal });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the events");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { events } = await response.json();

  return events;
}
