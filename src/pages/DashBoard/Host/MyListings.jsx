import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
// import { getHostRooms } from '../../../api/rooms'
import RoomDataRow from '../../../components/Dashboard/TableRows/RoomDataRow'
import useAuth from '../../../hooks/useAuth'
import { useQuery } from '@tanstack/react-query'
import Loader from '../../../components/Shared/Loader'
import { getHostRooms } from '../../../api/rooms'


const MyListings = () => {
  const { user, loading } = useAuth()
  // const [rooms, setRooms] = useState([])
  // useEffect(() => {
  //   getHostRooms(user?.email).then(data => setRooms(data))
  // }, [user])

  //converting to tanstack

  const {
    refetch,
    data: rooms = [],
    isLoading,
  } = useQuery({
    queryKey: ['rooms', user?.email],
    enabled: !loading,
    queryFn: async () => await getHostRooms(user?.email),
  })
  if (isLoading) return <Loader />
  console.log('loaded rooms', rooms);
  return (
    <>
      <Helmet>
        <title>My Listings | Dashboard</title>
      </Helmet>
      {
        rooms && Array.isArray(rooms) && rooms.length > 0 ? (
          <div className='container mx-auto px-4 sm:px-8'>
            <div className='py-8'>
              <div className='-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto'>
                <div className='inline-block min-w-full shadow rounded-lg overflow-hidden'>
                  <table className='min-w-full leading-normal'>
                    <thead>
                      <tr>
                        <th
                          scope='col'
                          className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                        >
                          Title
                        </th>
                        <th
                          scope='col'
                          className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                        >
                          Location
                        </th>
                        <th
                          scope='col'
                          className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                        >
                          Price
                        </th>
                        <th
                          scope='col'
                          className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                        >
                          From
                        </th>
                        <th
                          scope='col'
                          className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                        >
                          To
                        </th>
                        <th
                          scope='col'
                          className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                        >
                          Delete
                        </th>
                        <th
                          scope='col'
                          className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                        >
                          Update
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Room row data */}

                      {rooms.map(room => (
                        <RoomDataRow
                          key={room._id}
                          room={room}
                          refetch={refetch} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            no data
          </div>
        )
      }

    </>
  )
}

export default MyListings