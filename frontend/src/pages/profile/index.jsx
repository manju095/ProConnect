import DashboardLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/UserLayout'
import React, { useEffect, useState } from 'react'
import styles from "./index.module.css";
import {BASE_URL} from "@/config";
import {useDispatch, useSelector} from "react-redux";
import { getAboutUser} from "@/config/redux/action/authAction";
import {getAllPosts} from "@/config/redux/action/postAction";
import {clientServer} from "@/config";

export default function ProfilePage() {
    const authState = useSelector((state) => state.auth)
    let postState = useSelector((state) => state.postReducer)

    const [userProfile, setUserProfile] = useState({});
    const [userPosts, setUserPosts] = useState([]);
    const [modalType, setModalType] = useState(null);

    const [inputData, setInputData] = useState({company: "", position: "", years: ""});
    const [addEducation, setAddEducation] = useState({school:"", degree: "", fieldOfStudy: ""});

    const handleWorkInputChange = (e) => {
        const {name, value} = e.target;
        setInputData({...inputData, [name]: value});
    }

    const handleAddEducation = (e) => {
        const {name, value} = e.target;
        setAddEducation({...addEducation, [name]: value});
    }

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAboutUser({token: localStorage.getItem("token")}))
        dispatch(getAllPosts())
    }, [])

    useEffect(() => {
        if(authState.user != undefined) {
            setUserProfile(authState.user)
            let post = postState.posts.filter((post) => {
                return post.userId.username === authState.user.userId.username;
            })
            console.log(post, authState.user.userId.username);
            setUserPosts(post);
        }
    }, [authState.user, postState.posts])

    const updateProfilePicture = async (file) => {
        const formData = new FormData();
        formData.append("profile_picture", file);
        formData.append("token", localStorage.getItem("token"));

        const response = await clientServer.post("/update_profile_picture", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        dispatch(getAboutUser({token: localStorage.getItem("token")}));
    }

    const updateProfileData = async () => {
        const request = await clientServer.post("/user_update", {
            token: localStorage.getItem("token"),
            name: userProfile.userId.name,
        });

        const response = await clientServer.post("/update_profile_data", {
            token: localStorage.getItem("token"),
            bio: userProfile.bio,
            currentPost: userProfile.currentPost,
            pastWork: userProfile.pastWork,
            education: userProfile.education
        });

        dispatch(getAboutUser({token: localStorage.getItem("token")}));
    }

  return (
    <UserLayout>
        <DashboardLayout>
            {authState.user && userProfile.userId &&
                <div className={styles.container}>
                    <div className={styles.backDropContainer}>
                        <label htmlFor="profilePictureUpload" className={styles.backDrop_overlay}>
                            <p>Edit</p>
                        </label>
                        <input onChange={(e) => {
                            updateProfilePicture(e.target.files[0])
                        }} hidden type="file" id="profilePictureUpload" />
                        <img src={`${BASE_URL}/${userProfile.userId.profilePicture}`} alt="backDrop" />
                    </div>
            
                    <div className={styles.profileContainer_details}>
                        <div style={{display:"block", gap:"0.7rem"}}>
                            <div style={{flex:"0.8"}}>
                                <div style={{display:"block", width:"fit-content", alignItems:"center", gap:"1.2rem"}}>
                                    <input className={styles.nameEdit} type="text" value={userProfile.userId.name} onChange={(e) => {
                                        setUserProfile({...userProfile, userId: {...userProfile.userId, name: e.target.value}})
                                    }} />
                                    <p style={{color:"grey"}}>@{userProfile.userId.username}</p>
                                </div>            
                                <div>
                                    <textarea value={userProfile.bio} onChange={(e) => {
                                        setUserProfile({...userProfile, bio: e.target.value});
                                    }} rows={Math.max(3, Math.ceil(userProfile.bio.length / 80))}  //Adjust as needed
                                    style={{width:"100%"}} />
                                </div>
                            </div>
            
                            <div style={{flex:"0.2"}}>
                                <h3>Recent Activity</h3>
                                {userPosts.map((post) => {
                                    return (
                                        <div key={post._id} className={styles.postCard}>
                                            <div className={styles.card}>
                                                <div className={styles.card_profileContainer}>
                                                    {post.media !== "" ? <img src={`${BASE_URL}/${post.media}`} alt="" /> : <div style={{width: "3.4rem", height: "3.4rem"}}></div>}
                                                </div>
                                                <p>{post.body}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
            
                    <div className="workHistory">
                        <h4>Work History</h4>
            
                        <div className={styles.workHistoryContainer}>
                            {
                                userProfile.pastWork.map((work, index) => {
                                    return (
                                        <div key={index} className={styles.workHistoryCard}>
                                            <p style={{fontWeight:"bold", display:"flex", alignItems:"center", gap:"0.8rem"}}>{work.company} - {work.position}</p>
                                            <p>{work.years}</p>
                                        </div>
                                    )
                                })
                            }

                            <button className={styles.addWorkButton} onClick={() => {
                                setModalType("work");
                            }}>Add Work</button>
                        </div>
                    </div>

                    <div className="educationHistory">
                        <h4>Education History</h4>
            
                        <div className={styles.workHistoryContainer}>
                            {
                                userProfile.education.map((education, index) => {
                                    return (
                                        <div key={index} className={styles.workHistoryCard}>
                                            <p style={{fontWeight:"bold", display:"flex", alignItems:"center", gap:"0.8rem"}}>{education.school} - {education.degree}</p>
                                            <p>{education.fieldOfStudy}</p>
                                        </div>
                                    )
                                })
                            }

                            <button className={styles.addWorkButton} onClick={() => {
                                setModalType("education");
                            }}>Add Education</button>
                        </div>
                    </div>

                    {userProfile != authState.user && 
                        <div onClick={() => {
                            updateProfileData();
                        }} className={styles.updateProfileBtn}>Update Profile</div>
                    }
                </div>
            }

                        
            {
                modalType === "work" &&
                <div onClick={() => {
                    setModalType(null)
                }} className={styles.commentsContainer}>
                    <div onClick={(e) => {
                        e.stopPropagation()
                    }} className={styles.allCommentsContainer}>
                        <input onChange={handleWorkInputChange} name="company" className={styles.inputField} type="text" placeholder="Enter Company" />
                        <input onChange={handleWorkInputChange} name="position" className={styles.inputField} type="text" placeholder="Enter Position" />
                        <input onChange={handleWorkInputChange} name="years" className={styles.inputField} type="number" placeholder="Years" />
                        <div onClick={() => {
                            setUserProfile({...userProfile, pastWork: [...userProfile.pastWork, inputData]})
                            setModalType(null)
                        }} className={styles.updateProfileBtn}>Add Work</div>
                                                   
                    </div>
                </div>
            }

            {
                modalType === "education" &&
                <div onClick={() => {
                    setModalType(null)
                }} className={styles.commentsContainer}>
                    <div onClick={(e) => {
                        e.stopPropagation()
                    }} className={styles.allCommentsContainer}>
                        <input onChange={handleAddEducation} name="school" className={styles.inputField} type="text" placeholder="Enter School" />
                        <input onChange={handleAddEducation} name="degree" className={styles.inputField} type="text" placeholder="Enter Degree" />
                        <input onChange={handleAddEducation} name="fieldOfStudy" className={styles.inputField} type="text" placeholder="Enter Field Of Study" />
                        <div onClick={() => {
                            setUserProfile({...userProfile, education: [...userProfile.education, addEducation]})
                            setModalType(null)
                        }} className={styles.updateProfileBtn}>Add Education</div>
                                                   
                    </div>
                </div>
            }
        </DashboardLayout>
    </UserLayout>
  )
}
