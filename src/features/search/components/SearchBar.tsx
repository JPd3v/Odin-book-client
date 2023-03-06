/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { GoSearch } from 'react-icons/go';
import { LoadingSpinner, UserCard } from 'components/common';
import { useClickOutsideRef, useDebounce } from 'hooks';
import { Link, useNavigate } from 'react-router-dom';
import useSearch from '../hooks/useSearch';
import type { ISearchInput } from '../types';

export default function SearchBar() {
  const { register, watch, reset, handleSubmit } = useForm<ISearchInput>();
  const [openResult, setOpenResult] = useState(false);
  const textInput = watch('text');
  const formRef = useRef(null);
  const hasClickoutside = useClickOutsideRef(formRef);
  const debouncedInput = useDebounce<string>(textInput, 500);
  const search = useSearch(debouncedInput ?? '');
  const navigate = useNavigate();

  const stringToArray = debouncedInput?.trim().split(' ');
  const firstName = stringToArray ? stringToArray[0] ?? '' : null;
  const lastName = stringToArray ? stringToArray[1] ?? '' : null;

  function handleLinkClick() {
    setOpenResult(false);
    reset();
  }

  useEffect(() => {
    if (textInput) {
      return setOpenResult(true);
    }
    return setOpenResult(false);
  }, [search.isLoading, textInput]);

  useEffect(() => {
    setOpenResult(false);
  }, [hasClickoutside]);

  function onSubmit(data: ISearchInput) {
    const text = data.text?.trim().split(' ');
    const textFirstName = text ? text[0] ?? '' : null;
    const textLastName = text ? text[1] ?? '' : null;
    navigate(`/search?firstName=${textFirstName}&lastName=${textLastName}`);
  }

  return (
    <form
      ref={formRef}
      className="search-bar"
      onSubmit={handleSubmit(onSubmit)}
    >
      <input
        type="search"
        aria-label="search user"
        className="search-bar__input"
        autoComplete="off"
        {...register('text', { required: true })}
      />

      <GoSearch className="search-bar__search-svg" />
      {openResult ? (
        <div className="search-bar__results">
          {search?.data?.pages
            .slice(0, 1)
            .map((page) =>
              page.users.map((user) => (
                <UserCard
                  key={user._id}
                  friend={user}
                  clickHandler={() => handleLinkClick()}
                />
              ))
            )}

          {search?.data?.pages[0].users.length === 0 ? (
            <p className="search-bar__not-found">User not found</p>
          ) : null}

          {search.isLoading ? (
            <div className="search-bar__loading">
              <LoadingSpinner />
            </div>
          ) : null}

          {search.isError ? (
            <div className="search-bar__error">
              {search.error.response.data.message}
            </div>
          ) : null}
          <Link
            className="search-bar__view-more"
            to={`/search?firstName=${firstName}&lastName=${lastName}`}
            onClick={() => handleLinkClick()}
          >
            view more
          </Link>
        </div>
      ) : null}
    </form>
  );
}
