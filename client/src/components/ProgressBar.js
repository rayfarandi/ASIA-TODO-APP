// const ProgressBar = ({ progress }) => {
//   const colors = [
//     'rgb(255, 214, 161)',
//     'rgb(255, 175, 163)',
//     'rgb(108, 115, 148)',
//     'rgb(141, 181, 145)'
//   ]

//   const randomColor = colors[Math.floor(Math.random() * colors.length)]

//   return (
//     <div className="outer-bar">
//       <div
//         className="inner-bar"
//         style={{ width: `${progress}%`, backgroundColor: randomColor }}
//       ></div>
//     </div>
//   )
// }

// export default ProgressBar

const ProgressBar = ({ progress }) => {
  // Warna berdasarkan range progress
  let backgroundColor = '';
  let progressText = `${progress}%`; // Default teks menampilkan presentase

  // Menentukan warna berdasarkan rentang progress
  if (progress >= 1 && progress <= 20) {
    backgroundColor = 'rgb(255, 0, 0)'; // Merah terang
  } else if (progress >= 21 && progress <= 40) {
    backgroundColor = 'rgb(255, 99, 71)'; // Merah pucat
  } else if (progress >= 41 && progress <= 60) {
    backgroundColor = 'rgb(255, 182, 193)'; // Pink
  } else if (progress >= 61 && progress <= 80) {
    backgroundColor = 'rgb(255, 165, 0)'; // Orange terang
  } else if (progress >= 81 && progress <= 99) {
    backgroundColor = 'rgb(0, 255, 0)'; // Hijau terang
  } else if (progress === 100) {
    backgroundColor = '#4CAF50'; // Merah
    progressText = 'Selesai'; // Jika progress 100, teks berubah menjadi "Selesai"
  }

  return (
    <div className="outer-bar">
      <div
        className="inner-bar"
        style={{ width: `${progress}%`, backgroundColor }}
      >
        {progressText}
      </div>
    </div>
  )
}

export default ProgressBar
