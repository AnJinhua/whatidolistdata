import { useState, useEffect } from 'react'
import {
  FaUser,
  FaPencilAlt,
  FaHistory,
  FaMicrophone,
  FaRegCommentDots,
  FaKey,
  FaRegMoneyBillAlt,
} from 'react-icons/fa'
import { GrTransaction } from 'react-icons/gr'
import MessageNotification from './MessageNotification'
import { useSelector, useDispatch } from 'react-redux'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Switch from 'react-switch'
import { useCookies } from 'react-cookie'
import { connect } from 'react-redux'
import Image from '../../common/ImageHandler/Image'
import {
  ProfileOptionsGrard,
  ProfileOptionsContainer,
  ExpertProfile,
  FlexContainer,
  ProfileText,
  SubProfileText,
  ProfileLinkContainer,
  ProfileLink,
  SwitchFlex,
  ExpertIcon,
  MenuAvatarContainer,
  MenuNotification,
  CaretDownIcon,
  NotificationContainer,
} from './styles.component'
import {
  UpdateMyLocationVisibiliy,
  GetMyLocationVisibiliy,
} from '../../../actions/user'
import Notifications from './Notifications'
import Wallet from './Wallet'

function OptionLink({ UpdateMyLocationVisibiliy, GetMyLocationVisibiliy }) {
  const dispatch = useDispatch()
  const [options, setOptions] = useState(false)

  const [{ user }] = useCookies(['user'])
  const reduxUser = useSelector(({ user }) => user.profile)

  const visibility = useSelector((state) => state.auth.visibility)

  const handleClickAway = () => {
    setOptions(false)
  }

  useEffect(() => {
    GetMyLocationVisibiliy({ id: user?._id })
  }, [GetMyLocationVisibiliy, user?._id])

  function handleChange() {
    UpdateMyLocationVisibiliy({
      email: user?.email,
      locationVisbility: !visibility,
    })
  }

  const slug = user?.slug

  const category = user?.expertCategories[0]
  return (
    <NotificationContainer>
      <Notifications />
      <ClickAwayListener onClickAway={handleClickAway}>
        <ProfileOptionsGrard>
          <FlexContainer onClick={() => setOptions((prev) => !prev)}>
            <MenuAvatarContainer>
              {reduxUser?.imageUrl?.cdnUrl &&
              reduxUser?.imageUrl?.cdnUrl !== {} &&
              reduxUser?.imageUrl?.cdnUrl !== undefined &&
              reduxUser?.imageUrl?.cdnUrl !== null ? (
                <img
                  loading='lazy'
                  width='40'
                  height='40'
                  style={{
                    height: '3rem',
                    width: '3rem',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    marginLeft: '1rem',
                    backgroundColor: 'grey',
                  }}
                  src={reduxUser?.imageUrl?.cdnUrl}
                  alt='profile'
                />
              ) : (
                <img
                  loading='lazy'
                  className='image_view'
                  src='/img/profile.png'
                  alt='profile'
                  width='40'
                  height='40'
                  style={{
                    height: '3rem',
                    width: '3rem',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    marginLeft: '1rem',
                    backgroundColor: 'grey',
                  }}
                />
              )}

              <MenuNotification>
                <MessageNotification />
              </MenuNotification>
            </MenuAvatarContainer>
            <CaretDownIcon />
          </FlexContainer>

          <ProfileOptionsContainer in={options}>
            <ExpertProfile>
              <ProfileText className='name-text'>
                {user?.firstName} {user?.lastName}
              </ProfileText>
              <FlexContainer className='role-sign-con'>
                <ExpertIcon />
                <SubProfileText>{user?.role}</SubProfileText>
              </FlexContainer>
            </ExpertProfile>
            <ProfileLinkContainer>
              <ProfileLink onClick={handleClickAway} to='/profile'>
                <FaUser className='icon' />
                <ProfileText>Profile</ProfileText>
              </ProfileLink>

              <ProfileLink
                onClick={handleClickAway}
                to={
                  category
                    ? `/edit/expert/${category}/${slug}`
                    : `/edit/expert/new_category/${slug}`
                }
              >
                <FaPencilAlt className='icon' />
                <ProfileText>Edit Profile</ProfileText>
              </ProfileLink>

              <ProfileLink onClick={handleClickAway} to='/messages/ongoing'>
                <FaRegCommentDots className='icon' />
                <ProfileText>
                  Messages <MessageNotification />
                </ProfileText>
              </ProfileLink>

              {/* <ProfileLink
                onClick={handleClickAway}
                to={`/transaction-history/${slug}`}
              >
                <GrTransaction className="icon" />
                <ProfileText>Transactions</ProfileText>
              </ProfileLink> */}

              <ProfileLink onClick={handleClickAway} to='/logout'>
                <FaKey className='icon' />
                <ProfileText>Logout</ProfileText>
              </ProfileLink>

              <SwitchFlex>
                <ProfileText className='location'>
                  Location visibility
                </ProfileText>
                <Switch
                  onChange={handleChange}
                  checked={visibility}
                  width={40}
                  height={18}
                />
              </SwitchFlex>
            </ProfileLinkContainer>
          </ProfileOptionsContainer>
        </ProfileOptionsGrard>
      </ClickAwayListener>
      <Wallet />
    </NotificationContainer>
  )
}
const mapStateToProps = (state) => ({
  conversations: state.messenger.conversations,
})

export default connect(mapStateToProps, {
  UpdateMyLocationVisibiliy,
  GetMyLocationVisibiliy,
})(OptionLink)
