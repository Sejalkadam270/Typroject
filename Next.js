import { useQuery } from 'react-query';

function Next() {
  const folderId = '15v9V2PbzliU-HXzEkqJgDxdyxVSU3xb7';

  const { data: files, error } = useQuery(['files', folderId], () =>
    axios.get(`http://localhost:5000/files/${folderId}`).then(response => response.data)
  );

  if (error) {
    console.error('Error fetching files:', error);
  }

  return (
    <div>
      <h1>File List</h1>
      <ul>
        {files && files.map(file => (
          <li key={file.id}>
            <button onClick={() => openFileInBrowser(file.id)}>{file.name}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default Next;