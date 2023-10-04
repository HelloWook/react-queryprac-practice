import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "../../util/http";
import LoadingIndicator from "../UI/LoadingIndicator";
import ErrorBlock from "../UI/ErrorBlock";
import EventItem from "./EventItem.jsx";
export default function FindEventSection() {
  const searchElement = useRef();
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isPending, isError, error } = useQuery({
    //isPending -> 쿼리 중지되면 트루 됨 isloading 중지되어도 그냥 펄스 즉 쿼리가 중지되어로 pending은 로딩 돌아가고 loading은 돌아가지않음
    // 검색의 값에 따라변하기 때문에 키를 동적으로 전달해줘야한다
    // 다만 ref를 사용하면 state를 사용했을때와 달리 재렌더링 되지 않는다, -> state를 사용해서
    queryKey: ["events", { search: searchTerm }],
    // queryfn에 할당된 함수를 전달 이때 전달된 데이터는 쿼리키와 객체를 전달함
    // 객체를 받도록 지정
    queryFn: ({ signal }) => fetchEvents({ signal, searchTerm }),
    // 쿼리문이 동작하지 않도록 설정
    enabled: searchTerm !== undefined,
  });

  function handleSubmit(event) {
    event.preventDefault();
    setSearchTerm(searchElement.current.value);
  }

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
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id="search-form">
          <input
            type="search"
            placeholder="Search events"
            ref={searchElement}
          />
          <button>Search</button>
        </form>
      </header>
      {content}
    </section>
  );
}
