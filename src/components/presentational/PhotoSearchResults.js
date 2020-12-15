import React, { useEffect, useState, useCallback } from 'react'
import { useLazyQuery } from '@apollo/client'
import { SEARCH_PHOTOS } from '../../queries/trips'

import Loader from '../presentational/Loader'
import { toTitleCase } from '../../utils/StringHelpers'

function PhotoSearchResults({ searchProp, closeModal, setSelectedPhoto }) {
  const [photos, setPhotos] = useState(null);
  const [searchError, setSearchError] = useState(false);
  const [highlighted, setHighlight] = useState(false);
  const [loadMore, triggerLoadMore] = useState(false);

  const [searchPhotos, { fetchMore }] = useLazyQuery(SEARCH_PHOTOS, {
    onCompleted(data) {
      if (data.getPhotos.photos.length === 0) {
        setSearchError('Uh oh. Looks like we couldn\'t find what you were looking for. Try another search keyword.')
      }
      setPhotos(data.getPhotos)
    },
    onError(err) {
      // TODO: Handle Error
      console.log(err)
    }

  });

  useEffect(() => {
    searchProp !== '' && searchPhotos({ variables: { query: searchProp, page: null } })
  }, [searchProp, searchPhotos])

  useEffect(() => {
    if (loadMore) {
      fetchMore(
        {
          variables: { page: photos.page + 1 },
          updateQuery: (prevQuery, newQuery) => {
            const prevQueryPhotos = prevQuery.getPhotos.photos;
            const newQueryResults = newQuery.fetchMoreResult.getPhotos;
            const newPhotos = newQuery.fetchMoreResult.getPhotos.photos;
            const mergePhotos = [...prevQueryPhotos, ...newPhotos];
            newQueryResults.photos = mergePhotos;
            setPhotos(newQueryResults);
          }
        }
      )
      triggerLoadMore(false);
    }
  }, [loadMore])

  const handleSelection = useCallback(
    (photo, id) => {
      setSelectedPhoto(photo)
      setHighlight(id)
      closeModal()
    },
    [photos],
  )

  const handlePagination = () => {
    if (photos.next_page) {
      triggerLoadMore(true);
    }
  }

  if (!searchProp) return null

  return (
    <div style={{ top: '0px', left: '0px' }} className="absolute h-screen max-w-lg w-full rounded-lg shadow-2xl py-8 bg-white z-10 overflow-scroll">
      <div className="flex flex-row justify-between items-center cursor-pointer px-4 py-2">
        <h2 className="text-2xl">{toTitleCase(searchProp)} Photos</h2>
        <h2 onClick={closeModal} className="py-1 px-3 text-xl border rounded-full inline-block hover:bg-gray-200">X</h2>
      </div>
      {!photos && <div className=" pt-12 flex flex-row justify-center items-center"> <Loader /> </div>}
      {searchError && <h2 className="py-2 px-8">{searchError}</h2>}
      <div className="grid grid-cols-2 gap-2 text-center">
        {photos && photos.photos.map(photo => {
          return (
            <div style={{ justifySelf: 'center' }} className={`${photo.id === highlighted ? `bg-teal-500` : ''} cursor-pointer p-2 hover:bg-teal-400`} key={photo.id} onClick={() => handleSelection(photo.src.medium, photo.id)}>
              <img src={photo.src.medium} />
            </div>
          )
        })}
      </div>
      <div className="flex flex-row justify-center items-center">
        {photos?.next_page && <h4 className="cursor-pointer px-10 py-2 bg-gray-800 text-white rounded-sm mt-2" onClick={handlePagination}>Load More</h4>}
      </div>
    </div>
  )
}

export default PhotoSearchResults
