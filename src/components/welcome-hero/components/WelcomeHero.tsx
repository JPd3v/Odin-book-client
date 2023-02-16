import { LogInForm } from 'components/log-in';

export default function WelcomeHero() {
  return (
    <div className="welcome-hero__content">
      <div className="welcome-hero__text">
        <h2 className="welcome-hero__title">
          <span className="welcome-hero__text-highlight">odin book</span> <br />
          Your ideal place to meet new people and share your thoughts with
          friends.
        </h2>
      </div>
      <LogInForm />
    </div>
  );
}
