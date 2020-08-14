import React, { useEffect, useState, useCallback } from 'react'
import { useLazyQuery } from '@apollo/client'
import { SEARCH_PHOTOS } from '../../queries/trips'

import Spinner from '../../assets/media/spinner.svg'

function PhotoSearchResults({ searchProp, closeModal, setSelectedPhoto }) {
  const [photos, setPhotos] = useState(null);
  const [searchError, setSearchError] = useState(false);
  const [highlighted, setHighlight] = useState(false);

  const [searchPhotos] = useLazyQuery(SEARCH_PHOTOS, {
    onCompleted: data => {
      if (data.getPhotos.length === 0) {
        setSearchError('Uh oh. Looks like we couldn\'t find what you were looking for. Try another search keyword.')
      }
      setPhotos(data.getPhotos)
    }
  });

  useEffect(() => {
    try {
      searchPhotos({ variables: { query: searchProp } })
    } catch (error) {
      console.log(error);
    }
  }, [searchProp])

  const handleSelection = useCallback(
    (photo, id) => {
      setSelectedPhoto(photo)
      setHighlight(id)
      closeModal()
    },
    [photos],
  )

  if (!searchProp) return null

  return (
    <div style={{ top: '0px', left: '0px' }} className="absolute h-auto max-w-lg w-full rounded-lg shadow-2xl py-8 bg-white z-10">
      <div className="text-right mr-4 mb-4 cursor-pointer">
        <h2 onClick={closeModal} className="py-1 px-3 text-xl border rounded-full inline-block hover:bg-gray-200">X</h2>
      </div>
      {!photos && <div className="text-center"><img className="m-auto" src={Spinner} /></div>}
      {searchError && <h2 className="py-2 px-8">{searchError}</h2>}
      <div className="grid grid-cols-2 gap-2 text-center">
        {photos && photos.map(photo => {
          return (
            <div style={{ justifySelf: 'center' }} className={`${photo.id === highlighted ? `bg-teal-500` : ''} cursor-pointer p-2 hover:bg-teal-400`} key={photo.id} onClick={() => handleSelection(photo.src.medium, photo.id)}>
              <img src={photo.src.medium} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PhotoSearchResults
