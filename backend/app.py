from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from pymongo import MongoClient
# import cv_evaluator
import os
import requests
from werkzeug.utils import secure_filename
# from dotenv import load_dotenv
from openai import OpenAI
import time
import json
from bson import ObjectId
from bson.json_util import dumps
# from assistant import *

app = Flask(__name__)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Load environment variables
# load_dotenv()
    
# app = Flask(__name__)


# app = Flask(__name__)

# Load environment variables
# load_dotenv()

# Configuration
API_KEY=os.environ["API_KEY"]
# BASE_URL = os.environ["BASE_URL"]
UPLOAD_FOLDER=os.environ["UPLOAD_FOLDER"]
ASSISTANT_ID_CV=os.environ['ASSISTANT_ID_CV_EVALUATOR']
ASSISTANT_ID_EQ_Q=os.environ['ASSISTANT_EQ_Q_GENERATOR']
MONGO_DB_URI=os.environ['MONGODB_URI']
# MONGO_DB_URI=os.environ('MONGODB_URI')
DB_NAME=os.environ['DB_NAME']
JWT_SECRET_KEY=os.environ['JWT_SECRET_KEY']




# MONGO_DB_URI="mongodb+srv://ishwari:Ganesh%4024@testdb.a204r.mongodb.net/student_db"
# DB_NAME="student_db"
# API_KEY="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"
# ASSISTANT_ID_CV="asst_B3YYyaAiv4uKIvD1s1YYBylv"
# ASSISTANT_ID_EQ_Q="asst_1ZpWfFAWQNiedZ6nFjlVGH4w"
# UPLOAD_FOLDER="/uploads/"
# FLASK_APP="app"
# JWT_SECRET_KEY="Ishwari Pillay"


app.config["JWT_SECRET_KEY"]=JWT_SECRET_KEY


CORS(app)
# cors allow all origins and methods

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response



if __name__ == '__app__':
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    app.run(debug=True)

mongo = MongoClient(MONGO_DB_URI)

@app.route('/index')
def index():
    return 'Hi'

@app.route('/signup',methods=['POST','GET'])
def signup():
    data = request.get_json()
    phone = data.get('phone')
    password = data.get('password')
    
    db = mongo[DB_NAME]
    students=db['students']
    
    if mongo.db.students.find_one({"phone": phone}):
        return jsonify({"message": "Phone number already registered"}), 400
    
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    mongo.db.students.insert_one({"phone": phone, "password": hashed_password,"profile":{},"tasks": {
                "Uploading CV": False,
                "Completing the Profile": False,
                "Starting the EQ test": False,
                "Submit EQ test": False
            },"interviews":[]})
  
    return jsonify({"message": "User created successfully"}), 201


@app.route('/login',methods=['POST','GET'])
def login():
    data = request.get_json()
    phone = data.get('phone')
    password = data.get('password')
    
    db = mongo[DB_NAME]
    students=db['students']
    
    student = mongo.db.students.find_one({"phone": phone})
    if student and bcrypt.check_password_hash(student['password'], password):
        access_token = create_access_token(identity=str(student['_id']))
        #returns access token
        return jsonify(access_token=access_token), 200

    
    
    return jsonify({"message": "Invalid credentials"}), 401

@app.route('/profile', methods=['GET', 'PUT'])
@jwt_required()
def profile():
    current_user_id = get_jwt_identity()
    
    db = mongo[DB_NAME]
    students=db['students']

    
    if request.method == 'GET':
        student = mongo.db.students.find_one({"_id": ObjectId(current_user_id)})
        if student:
            #print(student)
            return dumps({"profile": student.get('profile'),"tasks": student.get('tasks'),"interviews":student.get('interviews')}), 200
            #return dumps({"profile": student.get('profile'),"tasks": student.get('tasks')}), 200
        return jsonify({"message": "User not found"}), 404
    
    elif request.method == 'PUT':
        data = request.get_json()
        #print(data)
        profile_data = data
        
        # Validate and sanitize profile data here
        # allowed_fields = ['name', 'bio', 'location', 'birthdate']
        # sanitized_profile = {k: v for k, v in profile_data.items() if k in allowed_fields}
        
        result = mongo.db.students.update_one(
            {"_id": ObjectId(current_user_id)},
            {"$set": {"profile": profile_data,"tasks":{"Completing the Profile":True,"Starting the EQ test":False,"Submit EQ test":False,"Uploading CV":True,}}},
        )
        
        if result.modified_count:
            return jsonify({"message": "Profile updated successfully"}), 200
        return jsonify({"message": "No changes made to profile"}), 200


@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()
    student = mongo.db.students.find_one({"_id": ObjectId(current_user_id)})
    if student:
        return jsonify(logged_in_as=student['phone']), 200
    return jsonify({"message": "User not found"}), 404

@app.route('/upload', methods=['POST','GET'])
@jwt_required()
def upload_file_and_run_thread():
    current_user_id = get_jwt_identity()
    
    db = mongo[DB_NAME]
    students=db['students']
    
    
    uploaded_file = request.files['file']
    #print(uploaded_file)
    client=OpenAI(api_key=API_KEY)

    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    # file = open(app.config['UPLOAD_FOLDER']+uploaded_file.filename, 'w')
    # file.write(uploaded_file.stream)
    # file.close()

    filename = secure_filename(uploaded_file.filename)
    file_path=os.path.join(UPLOAD_FOLDER, uploaded_file.filename)
    uploaded_file.save(file_path)
    #print(file_path)

    file = client.files.create(
        file=open(file_path, "rb"),
        purpose='assistants'
        )

    thread = client.beta.threads.create()

    message = client.beta.threads.messages.create(
        thread_id=thread.id,
        role="user",
        content="Extract the details from the CV.",
        attachments= [ { "file_id": file.id, "tools": [{"type": "file_search"}] } ],
        # file_ids=[file.id],
        
    )
    run = client.beta.threads.runs.create(
    thread_id=thread.id,
    assistant_id=ASSISTANT_ID_CV)

    # run = 
        
    # #print(run.status)
    # #print(run)
    # #print(run.status)

    # thread_messages = client.beta.threads.messages.list("thread_abc123")
    # for i in range(60):
    run_status = client.beta.threads.runs.retrieve(
        thread_id=thread.id,
        run_id=run.id
    )
    # #print(run_status)

    for i in range(60):
        #print(f"Waiting for response... ({i} seconds)")

        # get the latest run state
        result = client.beta.threads.runs.retrieve(
            thread_id=thread.id,
            run_id=run.id
        )

        if result.status == "requires_action": # run has executed
            # parse structured response from the tool call
            structured_response = json.loads(
        # fetch json from function arguments
                result.required_action.submit_tool_outputs.\
                    tool_calls[0].function.arguments
            )
            #print(structured_response)
            break
            # return structured_response

        # wait 1 second before retry
        time.sleep(1)

    
    result = mongo.db.students.update_one(
        {"_id": ObjectId(current_user_id)},
        {"$set": {"tasks": {"Uploading CV": True,"Completing the Profile": False,"Starting the EQ test": False,"Submit EQ test": False}}},
    )
            
    client.close()
    return structured_response

@app.route('/start-virtual-interview',methods=['POST','GET'])
@jwt_required()
def start_virtual_interview():
    current_user_id = get_jwt_identity()
    
    db = mongo[DB_NAME]
    students=db['students']

    if request.method == 'POST':
        client=OpenAI(api_key=API_KEY)
        thread = client.beta.threads.create()

        message = client.beta.threads.messages.create(
            thread_id=thread.id,
            role="user",
            content="Generate EQ Questions"    
        )
        run = client.beta.threads.runs.create(
        thread_id=thread.id,
        assistant_id=ASSISTANT_ID_EQ_Q)

        run_status = client.beta.threads.runs.retrieve(
            thread_id=thread.id,
            run_id=run.id
        )
        # #print(run_status)

        for i in range(60):
            #print(f"Waiting for response... ({i} seconds)")

            # get the latest run state
            result = client.beta.threads.runs.retrieve(
                thread_id=thread.id,
                run_id=run.id
            )

            if result.status == "requires_action": 
                # run has executed
                # parse structured response from the tool call
                structured_response = json.loads(
            # fetch json from function arguments
                    result.required_action.submit_tool_outputs.\
                        tool_calls[0].function.arguments
                )
                #print(structured_response)
                break
                # return structured_response

            # wait 1 second before retry
            time.sleep(1)
        client.close()
        structured_response["id"]=ObjectId()
        result = mongo.db.students.update_one(
            {'_id': ObjectId(current_user_id)},
            {'$set': {'interviews': structured_response, 'tasks': {'Starting Virtual Interview': True,'Completing the Profile': True,'Starting the EQ test': True,'Submit EQ test': False,'Uploading CV': True}}},
        )
        
        #print(result)
        # result = mongo.db.students.update_one(,
        #     {"$set": {"interviews": structured_response}}
        # )
        #print(structured_response)
        # return structured_response
        # isinstance(obj_id, ObjectId):
        # return str(obj_id)
        return {"interviewId":str(structured_response["id"])}

@app.route('/interview-questions/<interviewId>', methods=['GET'])
@jwt_required()
def interview_questions(interviewId):
    current_user_id = get_jwt_identity()
    
    db = mongo[DB_NAME]
    students = db['students']

    result = mongo.db.students.find_one({"_id": ObjectId(current_user_id), "interviews.id": ObjectId(interviewId)},
                                         {"interviews.$": 1})
    #print(result)
    
    if result and 'interviews' in result and len(result['interviews']) > 0:
        
        return {
            "id": str(result['interviews']['id']),
            "questions": result['interviews']['eq_questions']
        }
    return jsonify({"message": "Interview not found"}), 404


@app.route('/submit-interview/<interviewId>', methods=['POST'])
@jwt_required()
def submit_interview(interviewId):
    current_user_id = get_jwt_identity()
    
    db = mongo[DB_NAME]
    students = db['students']

    data = request.get_json()
    answers = data.get('answers', [])
    
    result = mongo.db.students.find_one(
        {"_id": ObjectId(current_user_id), "interviews.id": ObjectId(interviewId)},
        {"interviews.$": 1}
    )

    if not result or 'interviews' not in result:
        return jsonify({"message": "Interview not found"}), 404

    interview = result['interviews']
    questions = interview['eq_questions'] 
    total_score = 0

    for idx, answer in enumerate(answers):
        if idx < len(questions):
            # Check if the 'answers' field exists in the question
            if 'answers' not in questions[idx]:
                return jsonify({"message": f"Answers not found for question {idx + 1}"}), 400
            
            correct_answer_index = 0 
            
            if answer == questions[idx]['answers'][correct_answer_index]:
                total_score += 10  # Max score for the correct option
            elif len(questions[idx]['answers']) > 1 and answer == questions[idx]['answers'][1]:  # Second option
                total_score += 5  # Medium score
            elif len(questions[idx]['answers']) > 2 and answer == questions[idx]['answers'][2]:  # Third option
                total_score += 1  # Least score
    

    student = mongo.db.students.find_one({"_id": ObjectId(current_user_id)})
    rejectionReason = None
    if student:
        # 1. ITI trade condition
        iti_trade=student["profile"]["education"]["graduationDegree"]
        # iti_trade = next((edu["graduationDegree"] for edu in student.get("education", []) if "ITI" in edu.get("degree", "").upper()), None)
        if iti_trade and iti_trade.upper() not in ["ELECTRONICS", "ELECTRICAL"]:
            #print(f"Candidate is not eligible due to ITI trade: {iti_trade}")
            rejectionReason = "Degree not eligible for virtual interview"
            #print(iti_trade)
            

        # 2. Parents' income condition
        parents_income=student["profile"]["familyInfo"]["parentsAnnualIncome"]
        # parents_income = student.get("familyInfo", {}).get("parentsAnnualIncome", 0)
        if int(parents_income) > 1500000:  # 15 lac in rupees
            #print("Candidate is not eligible due to high parents' income.")
            rejectionReason = "Annual Income not eligible for virtual interview"
            #print(parents_income)
            

        # 3. Parents' profession condition
        parent_professions = [student.get("profile", {}).get("familyInfo", {}).get("fathersProfession"), 
                            student.get("profile", {}).get("familyInfo", {}).get("mothersProfession")]
        if any(prof in ["JUDGE", "IAS", "IPS"] for prof in parent_professions if prof):
            #print("Candidate is not eligible due to parent's profession.")
            rejectionReason = "Profession not eligible for virtual interview"
            #print(parent_professions)
           

        # 4. IQ/EQ questions condition
        if total_score < 70:
            #print("Candidate is not eligible due to low IQ/EQ score.")
            rejectionReason = "IQ/EQ score not eligible for virtual interview"
            

        # 5. 10th marks condition
        # tenth_marks = next((float(edu["tenthBoardMarks"]["percentage"]) student.get("education"))))                 
        # iti_trade = next((edu["graduationDegree"] for edu in student.get("education", []) if "ITI" in edu.get("degree", "").upper()), None)
        tenth_marks=int(student["profile"]["education"]["tenthBoardMarks"]["percentage"])
        if tenth_marks is not None and tenth_marks > 80:
            #print(f"Candidate is not eligible due to high 10th marks: {tenth_marks}%")
            rejectionReason = "10th marks not eligible for virtual interview"
            #print(tenth_marks)
            

    #print(iti_trade)
    #print(parents_income)
    #print(parent_professions)
    #print(tenth_marks)
    
    
    # Store the score in the database if needed
    mongo.db.students.update_one(
        {'_id': ObjectId(current_user_id)},
        {'$set': {'interviews.score': total_score,'interviews.rejectionReason': rejectionReason, 'tasks': {'Starting Virtual Interview': True,'Completing the Profile': True,'Starting the EQ test': True,'Submit EQ test': True,'Uploading CV': True}}}  # Update the interview score
    )
    
     
    return jsonify({"total_score": total_score}), 200


@app.route('/rate',methods=['POST','GET'])
@jwt_required()
def rate_students():
    

    current_user_id = get_jwt_identity()
    
    db = mongo[DB_NAME]
    students=db['students']
    
    if request.method == 'GET':
        student = mongo.db.students.find_one({"_id": ObjectId(current_user_id)})
        if student:
            # 1. ITI trade condition
            iti_trade = next((edu["degree"] for edu in student.get("education", []) if "ITI" in edu.get("degree", "").upper()), None)
            if iti_trade and iti_trade.upper() not in ["ELECTRONICS", "ELECTRICAL"]:
                #print(f"Candidate is not eligible due to ITI trade: {iti_trade}")
                return

            # 2. Parents' income condition
            parents_income = student.get("familyInfo", {}).get("parentsIncome", 0)
            if parents_income > 1500000:  # 15 lac in rupees
                #print("Candidate is not eligible due to high parents' income.")
                return

            # 3. Parents' profession condition
            # parent_professions = [data.get("familyInfo", {}).get("fatherProfession"), 
            #                     data.get("familyInfo", {}).get("motherProfession")]
            # if any(prof in ["JUDGE", "IAS", "IPS"] for prof in parent_professions if prof):
            #     #print("Candidate is not eligible due to parent's profession.")
            #     return

            # 4. IQ/EQ questions condition
            # iq_eq_score = data.get("testScores", {}).get("iqEqCorrect", 0)
            # if iq_eq_score <= 2:
            #     #print("Candidate is not eligible due to low IQ/EQ score.")
            #     return

            # 5. 10th marks condition
            # tenth_marks = next((float(edu["percentage"]) for edu in data.get("education", []) 
            #                     if edu.get("degree", "").upper() == "HIGH SCHOOL"), None)
            # if tenth_marks is not None and tenth_marks > 80:
            #     #print(f"Candidate is not eligible due to high 10th marks: {tenth_marks}%")
            #     return

            # #print("Candidate is eligible based on all criteria.")
            #     # return dumps({"profile": student.get('profile', {})}), 200
            #     return jsonify({"message": "User not found"}), 404
            mongo.close()
            return dumps({"profile": student.get('profile', {})}), 200



@app.route('/logout')
def logout():
    return 'Logout'
