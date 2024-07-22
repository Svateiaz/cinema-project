import { Parallax, ParallaxLayer } from "@react-spring/parallax";
import cinema from "/cinema4.jpg";
import projector from "/projector.jpg";
import movies from "/movies.jpg";
import room from "/room.jpg";
import styles from "./Home.module.css";
import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.homeContainer}>
      <Parallax pages={4}>
        <ParallaxLayer
          offset={0}
          speed={0.25}
          factor={4}
          style={{ backgroundImage: `url(${cinema})` }}
          className={styles.layerImage}
        ></ParallaxLayer>
        <ParallaxLayer
          sticky={{ start: 0, end: 0.25 }}
          className={styles.layerText}
        >
          <div className={styles.textBlock}>
            <h1 className={styles.heading}>Welcome to Cinemedia</h1>
            <p className={styles.subheading}>Your ultimate cinematic experience begins here.</p>
          </div>
        </ParallaxLayer>

        <ParallaxLayer
          offset={1}
          speed={0.8}
          factor={3}
          style={{ backgroundImage: `url(${projector})` }}
          className={styles.layerImage}
        ></ParallaxLayer>
        <ParallaxLayer
          sticky={{ start: 1.4, end: 1.7 }}
          className={styles.layerText}
        >
          <div className={styles.textBlock}>
            <h1 className={styles.heading}>Immersive Audio & Visual Technologies</h1>
            <p className={styles.subheading}>Experience Dolby Atmos, 2D, 3D, and more.</p>
          </div>
        </ParallaxLayer>

        <ParallaxLayer
          offset={2}
          speed={0.5}
          factor={2}
          style={{ backgroundImage: `url(${movies})` }}
          className={styles.layerImage}
        ></ParallaxLayer>
        <ParallaxLayer
          sticky={{ start: 2.7, end: 2.8 }}
          className={styles.screenText}
        >
        </ParallaxLayer>

        <ParallaxLayer
          offset={3}
          speed={1.5}
          factor={1}
          style={{ backgroundImage: `url(${room})` }}
          className={styles.layerImage}
        ></ParallaxLayer>
        <ParallaxLayer
          sticky={{ start: 3, end: 3.25 }}
          className={styles.buttonsContainer}
        >
          <div className={styles.button} onClick={() => navigate("/movies")}>
            <h1 className={styles.buttonTitle}>Explore More</h1>
            <p>Discover a world of movies. Click here to explore.</p>
          </div>
          <div className={styles.button} onClick={() => navigate("/login")}>
            <h1 className={styles.buttonTitle}>Sign up today</h1>
            <p>Embark on a personalized cinematic journey</p>
            <i>Discover tailored movie recommendations crafted just for you.</i>
          </div>
        </ParallaxLayer>
      </Parallax>
    </div>
  );
};

export default Home;
