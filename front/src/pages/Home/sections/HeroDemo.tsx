import { heroDemo } from '../../../data/accueil';
import styles from './HeroDemo.module.css';

/**
 * Téléphone de démonstration : écran de réservation d'un client fictif et notifications.
 * Purement décoratif, donc caché aux lecteurs d'écran.
 */
export function HeroDemo() {
  const [booking, payment] = heroDemo.notifications;

  return (
    <div className={styles.scene} aria-hidden="true">
      <div className={styles.circle} />
      <div className={`${styles.phone} anim-float`}>
        <div className={styles.screen}>
          <div className={styles.top}>
            <span className={styles.business}>{heroDemo.business}</span>
            <span className={styles.screenTitle}>{heroDemo.title}</span>
          </div>
          <div className={styles.body}>
            <span className={styles.month}>{heroDemo.month}</span>
            <div className={styles.calendar}>
              {heroDemo.weekdays.map((weekday, i) => (
                <span key={`${weekday}-${i}`} className={styles.weekday}>
                  {weekday}
                </span>
              ))}
              {heroDemo.days.map(({ day, off, selected }) => (
                <span
                  key={day}
                  className={[styles.day, off ? styles.off : '', selected ? styles.selected : '']
                    .filter(Boolean)
                    .join(' ')}
                >
                  {day}
                </span>
              ))}
            </div>
            <div className={styles.slots}>
              {heroDemo.slots.map((slot) => (
                <span
                  key={slot}
                  className={slot === heroDemo.selectedSlot ? `${styles.slot} ${styles.slotSelected}` : styles.slot}
                >
                  {slot}
                </span>
              ))}
            </div>
            <span className={styles.book}>{heroDemo.button}</span>
          </div>
        </div>
      </div>
      <div className={`${styles.toast} ${styles.toastTop} anim-float`}>
        <span className={styles.toastLabel}>{booking.label}</span>
        <span className={styles.toastValue}>{booking.value}</span>
      </div>
      <div className={`${styles.toast} ${styles.toastBottom} anim-float`}>
        <span className={styles.check}>✓</span>
        <span className={styles.toastText}>
          <span className={styles.toastLabel}>{payment.label}</span>
          <span className={styles.toastValue}>{payment.value}</span>
        </span>
      </div>
    </div>
  );
}
