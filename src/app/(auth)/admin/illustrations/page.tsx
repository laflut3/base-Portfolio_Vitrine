"use client";
import { ChangeEvent, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getDraws, createDraw, deleteDraw, updatedDraw } from '@lib/drawsLib/service/DrawService';
import { Draw, NewDraw } from '@lib/drawsLib/type/IDraw';
import Image from 'next/image';


export default function MyIllustrationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [draws, setDraws] = useState<Draw[]>([]);
  const [newDraw, setNewDraw] = useState<NewDraw>({ title: '', image: '' });
  const [editDrawId, setEditDrawId] = useState<string | null>(null);
  const [fileName, setFileName] = useState('Aucun fichier choisi');
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchDraws = async () => {
      setLoading(true);
      try {
        const response = await getDraws(currentPage);
        if (response) {
          setDraws((prev) => [...prev, ...response.draws]);
          setTotalPages(response.totalPages);
        }
      } catch (error) {
        console.error('Failed to load draws:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDraws();
  }, [currentPage]);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/admin');
    }
  }, [status, session, router]);

  const handleAddDraw = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const createdDraw = await createDraw(newDraw);
      setDraws([...draws, createdDraw]);
      setNewDraw({ title: '', image: '' });
      setFileName('Aucun fichier choisi');
    } catch (error) {
      console.error('Error adding Draw:', error);
    }
  };

  const handleDeleteDraw = async (id: string) => {
    try {
      await deleteDraw(id);
      setDraws(draws.filter((draw) => draw._id !== id));
    } catch (error) {
      console.error('Error deleting draw:', error);
    }
  };

  const handleEditDraw = (draw: Draw) => {
    setEditDrawId(draw._id);
    setNewDraw({ title: draw.title, image: '' });
    setShowPopup(true);
  };

  const handleUpdateDraw = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editDrawId) {
      try {
        await updatedDraw(editDrawId, newDraw);
        setDraws(draws.map((draw) => (draw._id === editDrawId ? { ...draw, ...newDraw } : draw)));
        setNewDraw({ title: '', image: '' });
        setFileName('Aucun fichier choisi');
      } catch (error) {
        console.error('Error updating draw:', error);
      }
    }
  };

  const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setNewDraw({ ...newDraw, image: reader.result as string });
    };
    reader.readAsDataURL(file);
    setFileName(file.name);
  };

  const loadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  if (status === 'loading' || !session) {
    return (
      <div className="flex items-center justify-center h-auto min-h-screen bg-white">
        Loading ...
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center justify-start mt-[6%] min-h-screen py-12 px-4">
      <h2 className="font-photomark-signature text-5xl font-bold text-tertiary-color mb-8">Mes illustrations</h2>
      <form onSubmit={handleAddDraw} className="mb-8">
        <label htmlFor='title' className='text-sm font-helvetica-now-text mb-1'>
          Titre
        </label>
        <input
          type="text"
          placeholder="Ex: Mon illustration"
          value={newDraw.title}
          onChange={(e) => setNewDraw({ ...newDraw, title: e.target.value })}
          className="bg-[#D9D9D9] border shadow-spe border-gray-300 py-2 mb-2 w-full px-4 rounded text-xs font-helvetica-now-text-light focus:outline-none focus:ring-2 focus:ring-secondary-color placeholder:text-black"
        />
        <div className="flex flex-col font-helvetica-now-text">
          <label htmlFor="file" className="text-sm font-helvetica-now-text mb-1">
            Ma future illustration !
          </label>
          <div className="relative shadow-spe bg-[#D9D9D9] py-1.5 px-4 rounded text-xs font-helvetica-now-text-light text-black flex items-center">
            <input
              type="file"
              id="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept="image/*"
              onChange={handleChangeFile}
            />
            <label
              htmlFor="file"
              className="bg-[#B8D4AB] border border-gray-300 py-1 px-4 rounded text-xs font-helvetica-now-text-light text-black cursor-pointer hover:bg-[#A2B97D]"
            >
              Choisir un fichier
            </label>
            <label htmlFor="file" className="ml-2">
              {fileName}
            </label>
          </div>
        </div>
        <button
          type="submit"
          className="w-full mt-4 bg-secondary-color text-xs text-white py-3 px-4 rounded font-helvetica-now-text-bold hover:bg-secondary-color-dark focus:outline-none focus:ring-2 focus:ring-secondary-color shadow-md"
        >
          Ajouter l&apos;illustration
        </button>
      </form>

      {loading && currentPage === 1 ? (
        <div className="flex items-center justify-center h-auto min-h-screen">
          Loading ...
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl">
          {draws.map((draw) => (
            <DrawCard
              key={draw._id}
              draw={draw}
              handleEditDraw={handleEditDraw}
              handleDeleteDraw={handleDeleteDraw}
            />
          ))}
        </ul>
      )}

      {currentPage < totalPages && (
        <div className="text-center mt-4">
          <button
            onClick={loadMore}
            className="px-6 py-2 text-lg text-black font-helvetica-now-text rounded-lg bg-secondary-color hover:bg-tertiary-color hover:text-white"
          >
            Voir plus
          </button>
        </div>
      )}

      {showPopup && (
        <EditPopup
          newDraw={newDraw}
          setNewDraw={setNewDraw}
          handleChangeFile={handleChangeFile}
          handleUpdateDraw={handleUpdateDraw}
          setShowPopup={setShowPopup}
        />
      )}
    </main>
  );
}

interface DrawCardProps {
  draw: Draw;
  handleEditDraw: (draw: Draw) => void;
  handleDeleteDraw: (id: string) => void;
}

const DrawCard = ({ draw, handleEditDraw, handleDeleteDraw }: DrawCardProps) => {
  return (
    <li key={draw._id} className="flex flex-col items-center justify-center mb-6 font-helvetica-now-text-bold p-4">
      <h3 className="font-bold text-lg text-center mb-3">{draw.title}</h3>
      <Image src={draw.image} alt={draw.title} width={0} height={0} className="object-cover mb-4 rounded-md h-40 w-40" />
      <div className="flex space-x-2">
        <button
          onClick={() => handleEditDraw(draw)}
          className="bg-tertiary-color text-white text-xs py-2 px-4 rounded hover:bg-tertiary-color-dark transition-colors"
        >
          Modifier
        </button>
        <button
          onClick={() => handleDeleteDraw(draw._id)}
          className="bg-secondary-color text-white py-2 text-xs px-4 rounded hover:bg-secondary-color-dark transition-colors"
        >
          Supprimer
        </button>
      </div>
    </li>
  );
};

interface EditPopupProps {
  newDraw: NewDraw;
  setNewDraw: (newDraw: NewDraw) => void;
  handleChangeFile: (e: ChangeEvent<HTMLInputElement>) => void;
  handleUpdateDraw: (e: React.FormEvent<HTMLFormElement>) => void;
  setShowPopup: (showPopup: boolean) => void;
}

const EditPopup = ({ newDraw, setNewDraw, handleChangeFile, handleUpdateDraw, setShowPopup }: EditPopupProps) => {
  return (
    <div
      className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 font-helvetica-now-text flex justify-center items-center"
      onClick={() => setShowPopup(false)}
    >
      <div
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold mb-6 font-photomark-signature text-center text-tertiary-color">
          Modifier l&apos;illustration
        </h2>
        <form onSubmit={handleUpdateDraw} className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="title" className="text-sm font-helvetica-now-text-medium text-gray-700 mb-2">
              Titre de l&apos;illustration
            </label>
            <input
              id="title"
              type="text"
              placeholder="Titre"
              value={newDraw.title}
              onChange={(e) => setNewDraw({ ...newDraw, title: e.target.value })}
              className="bg-[#D9D9D9] py-2 px-4 rounded text-xs font-helvetica-now-text-light text-black"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="file" className="text-sm font-helvetica-now-text-medium text-gray-700 mb-2">
              Remplacer l&apos;image
            </label>
            <input
              id="file"
              type="file"
              accept="image/*"
              onChange={handleChangeFile}
              className="bg-[#D9D9D9] py-1 px-4 rounded text-xs font-helvetica-now-text-light text-black"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              className="bg-tertiary-color text-white font-helvetica-now-text-bold text-sm py-2 px-6 rounded hover:bg-tertiary-color-dark transition-colors focus:outline-none focus:ring-2 focus:ring-tertiary-color focus:ring-offset-2"
            >
              Modifier
            </button>
            <button
              type="button"
              className="bg-secondary-color text-white text-sm font-helvetica-now-text-bold py-2 px-6 rounded hover:bg-secondary-color-dark transition-colors focus:outline-none focus:ring-2 focus:ring-secondary-color focus:ring-offset-2"
              onClick={() => setShowPopup(false)}
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
