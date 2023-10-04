import { useQuery } from "@tanstack/react-query";

import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import EventItem from "./EventItem.jsx";
import { fetchEvents } from "../../util/http.js";

export default function NewEventsSection() {
  // 구조분해 사용
  // 받은 데이터 , 데이터받았는지 유무, 에러 발생했는지, 발생한 에러 확인
  const { data, isPending, isError, error } = useQuery({
    // 전송하는 모든 쿼리에는 키가 있다 요청으로 생성된 데이터를 캐시 처리 -> 이걸로 응답 재사용 가능 // 다양한 자료형 사용가능
    queryKey: ["events"],
    // 쿼리 함수 의미 실제요청에 필요한 함수 정의
    queryFn: fetchEvents,
    // staleTime :  캐쉬에 데이터가 있을때 0을 사용하면 즉시 가져오고 5000일시 5 초 후에 가져옴
    // gcTime :데이터에 캐시를 얼마나 저장할지 제어하는 것
  }); //섹션에 필요한 이벤트 데이터를 가져오고, 로딩 상태에 대한 정보를 제공함

  let content;

  if (isPending) {
    content = <LoadingIndicator />;
  }

  if (isError) {
    // 에러 발생시 undefine이면 메세지 출력 아닐시 작성된 에러메시지 표시
    content = (
      <ErrorBlock
        title="An error occurred"
        message={error.info?.message || "Failed to fetch events"}
      />
    );
  }

  if (data) {
    content = (
      <ul className="events-list">
        {data.map((event) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="content-section" id="new-events-section">
      <header>
        <h2>Recently added events</h2>
      </header>
      {content}
    </section>
  );
}
