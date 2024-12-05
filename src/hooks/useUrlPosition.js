import { useSearchParams } from 'react-router-dom';

export function useUrlPosition() {
  //__URL parameters____//
  const [searchParams] = useSearchParams(); // React router hook
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  return [lat, lng];
}
