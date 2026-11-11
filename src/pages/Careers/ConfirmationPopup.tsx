import Popup from "../../components/Popup/Popup";
import { publicUrl } from "../../utils/publicUrl";

type ConfirmationProps = {
  isOpen: boolean;
  onClose: () => void;
  className?: string; // for per-use styling variants
};

// Controlled by the parent: Careers decides when it's open.
const Confirmation = ({ isOpen, onClose, className = "" }: ConfirmationProps) => {

    return (
        <Popup isOpen={isOpen} onClose={onClose} className={`popup--success ${className}`}>
            <h2 className="git-title" style={{fontSize: '40px'}}>Thanks for reaching out!</h2>
            <img src={publicUrl('/images/meet_the_team/meet_the_pugs.webp')} alt="Pugs Pic" />
            <p id="lower_text">Your information is in our hands, and we’re excited to learn a little more about you. If there’s a potential fit, we’ll be in touch.</p>
        </Popup>
    )
};

export default Confirmation;
