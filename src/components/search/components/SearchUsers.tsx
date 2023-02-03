/* eslint-disable react/jsx-props-no-spreading */
import { GoSearch } from 'react-icons/go';
import { LoadingSpinner, UserCard } from 'components/common';
import { ISearchInput } from 'components/search/types';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import useSearch from '../hooks/useSearch';

export default function SearchUsers() {
  const [searchParams, setSearchParams] = useSearchParams();
  const loadingDivRef = useRef(null);

  const firstName = searchParams.get('firstName') ?? '';
  const lastName = searchParams.get('lastName') ?? '';
  const searchText = `${firstName} ${lastName}`;

  const { register, handleSubmit } = useForm<ISearchInput>({
    defaultValues: { text: searchText.trim() },
  });
  const search = useSearch(searchText);

  function onSubmit(formInput: ISearchInput) {
    const stringToArray = formInput.text?.trim().split(' ');

    const params = {
      firstName: stringToArray[0] ?? '',
      lastName: stringToArray[1] ?? '',
    };
    setSearchParams(params);
  }

  useEffect(() => {
    const intersectionObserver = new IntersectionObserver((entries) => {
      if (entries[0].intersectionRatio <= 0) return;

      if (search.hasNextPage) {
        search.fetchNextPage();
        intersectionObserver.disconnect();
      }
    });

    if (loadingDivRef.current) {
      intersectionObserver.observe(loadingDivRef.current);
    }

    return () => {
      return intersectionObserver.disconnect();
    };
  }, [loadingDivRef, search]);

  return (
    <>
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="search-page__form"
      >
        <div className="search-form__form-input-wrapper">
          <input
            placeholder="Search people"
            type="text"
            {...register('text', { required: true })}
            className="search-form__form-input"
            autoComplete="off"
          />

          <button
            aria-label="search"
            type="submit"
            className="search-form__submit"
          >
            <GoSearch />
          </button>
        </div>
      </form>
      {search?.data || search.isFetching ? (
        <div className="search-page__results">
          {search?.data?.pages.map((page) =>
            page.users.map((user) => <UserCard key={user._id} friend={user} />)
          )}

          {search?.data?.pages[0].users.length === 0 ? (
            <p>User not found</p>
          ) : null}

          {search.isFetching ? (
            <div className="search-page__loading">
              <LoadingSpinner />
            </div>
          ) : null}
        </div>
      ) : null}
      {search.isError ? <p>{search.error.response.data.message}</p> : null}

      {search.hasNextPage ? (
        <div className="infite-scroll-post-loading" ref={loadingDivRef} />
      ) : null}
    </>
  );
}
