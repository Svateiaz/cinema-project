/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useCreateMovie } from "../../utils/MoviesQueries/useCreateMovies";
import { useUpdateMovie } from "../../utils/MoviesQueries/useUpdateMovie";
import styles from "./CreateMovieForm.module.css";
import { useTranslation } from "react-i18next";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const genres = [
  { value: 'Action', label: 'Action' },
  { value: 'Adventure', label: 'Adventure'},
  { value: 'Comedy', label: 'Comedy' },
  { value: 'Fantasy', label: 'Fantasy'},
  { value: 'Animation', label: 'Animation'},
  { value: 'Drama', label: 'Drama' },
  { value: 'Romance', label: 'Romance' },
  { value: 'Mystery', label: 'Mystery'},
  { value: 'Horror', label: 'Horror' },
];
const ratings = [
  { value: 'G', label: 'G' },
  { value: 'PG', label: 'PG' },
  { value: 'PG-13', label: 'PG-13' },
  { value: 'R', label: 'R' },
  { value: 'NC-17', label: 'NC-17' },
];

function CreateMovieForm({ initialData, isEditing, closeModal }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    enTitle: "",
    roTitle: "",
    genre: [],
    duration: "",
    hours: "",
    minutes: "",
    enDescription: "",
    roDescription: "",
    rating: "",
    cast: "",
    poster: null,
    trailer: null,
    releaseDate: "",
  });
  const [posterName, setPosterName] = useState("No file chosen");
  const [trailerName, setTrailerName] = useState("No file chosen");

  const { createMovie } = useCreateMovie();
  const { updateMovie } = useUpdateMovie();

  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({
        ...initialData,
        releaseDate: initialData.releaseDate.split("T")[0], 
        poster: null,
        trailer: null,
        genre: initialData.genre.split(',').map(g => ({ value: g, label: g })),
        hours: Math.floor(initialData.duration / 60),
        minutes: initialData.duration % 60,
      });
      setPosterName(initialData.poster ? "Poster selected" : "No file chosen");
      setTrailerName(initialData.trailer ? "Trailer selected" : "No file chosen");
    }
  }, [isEditing, initialData]);

  const handleChange = (e) => {
    const { name, type, files, value } = e.target;

    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
      if (name === "poster") setPosterName(files[0]?.name || "No file chosen");
      if (name === "trailer") setTrailerName(files[0]?.name || "No file chosen");
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleGenreChange = (selectedOptions) => {
    setFormData({ ...formData, genre: selectedOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    const totalDuration = parseInt(formData.hours) * 60 + parseInt(formData.minutes);
    formData.duration = totalDuration;

    Object.keys(formData).forEach((key) => {
      if (key === "genre") {
        data.append(key, formData[key].map(g => g.value).join(","));
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      if (isEditing) {
        await updateMovie({ data, movieId: initialData._id });
      } else {
        await createMovie(data);
      }
      closeModal(); 
    } catch (error) {
      console.error("Error creating/updating movie:", error);
    }
  };

  const handleFormClick = (event) => {
    event.stopPropagation();
  };

  return (
    <div className={styles.form}>
      <form onSubmit={handleSubmit} onClick={handleFormClick} encType="multipart/form-data" className={styles.inputContainer}>
        <input type="text" name="enTitle" value={formData.enTitle} onChange={handleChange} placeholder={"English Title"} className={styles.input} />
        <input type="text" name="roTitle" value={formData.roTitle} onChange={handleChange} placeholder={"Romanian Title"} className={styles.input} />

        <Select
          closeMenuOnSelect={false}
          components={makeAnimated()}
          isMulti
          options={genres}
          onChange={handleGenreChange}
          value={formData.genre}
          className={styles.select}
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: 'var(--color-dark-2)',
              borderColor: '#ccc',
              color: 'var(--color-light)',
              fontSize: '16px',
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: 'var(--color-dark-2)',
              fontSize: '16px',
            }),
            multiValue: (base) => ({
              ...base,
              backgroundColor: 'var(--color-light)',
              fontSize: '16px',
            }),
            singleValue: (base) => ({
              ...base,
              color: 'var(--color-light)',
              fontSize: '16px',
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isFocused ? 'var(--color-brand)' : 'var(--color-dark-2)',
              color: state.isFocused ? 'var(--color-light)' : 'var(--color-light)',
              fontSize: '16px',
            }),
          }}
        />

        <Select
          options={ratings}
          onChange={(selected) => setFormData({ ...formData, rating: selected.value })}
          value={ratings.find(r => r.value === formData.rating)}
          className={styles.select}
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: 'var(--color-dark-2)',
              borderColor: '#ccc',
              color: 'var(--color-light)',
              fontSize: '16px',
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: 'var(--color-dark-2)',
              fontSize: '16px',
            }),
            singleValue: (base) => ({
              ...base,
              color: 'var(--color-light)',
              fontSize: '16px',
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isFocused ? 'var(--color-brand)' : 'var(--color-dark-2)',
              color: state.isFocused ? 'var(--color-light)' : 'var(--color-light)',
              fontSize: '16px',
            }),
          }}
        />

        <div className={styles.durationContainer}>
          <input type="number" name="hours" value={formData.hours} onChange={handleChange} placeholder={"Hours"} className={`${styles.input} ${styles.smallInput}`} />
          <input type="number" name="minutes" value={formData.minutes} onChange={handleChange} placeholder={"Minutes"} className={`${styles.input} ${styles.smallInput}`} />
          <input type="date" name="releaseDate" value={formData.releaseDate} onChange={handleChange} placeholder="Release Date" className={styles.input} />
        </div>

        <textarea name="enDescription" value={formData.enDescription} onChange={handleChange} placeholder={"English Description"} className={styles.textarea} />
        <textarea name="roDescription" value={formData.roDescription} onChange={handleChange} placeholder={"Romanian Description"} className={styles.textarea} />
        
        <input type="text" name="cast" value={formData.cast} onChange={handleChange} placeholder={t("movies.cast")} className={styles.input} />

        <div className={styles.fileInputContainer}>
          <input type="file" name="poster" onChange={handleChange} accept="image/*" className={styles.input} id="posterInput" />
          <label htmlFor="posterInput" className={styles.fileLabel}>
            {posterName}
          </label>
        </div>

        <div className={styles.fileInputContainer}>
          <input type="file" name="trailer" onChange={handleChange} accept="video/*" className={styles.input} id="trailerInput" />
          <label htmlFor="trailerInput" className={styles.fileLabel}>
            {trailerName}
          </label>
        </div>

       

        <button type="submit" className={styles.button}>{isEditing ? "Update Movie" : t("movies.submit")}</button>
      </form>
    </div>
  );
}

export default CreateMovieForm;
